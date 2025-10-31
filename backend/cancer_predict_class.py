"""
cancer_predict_class.py
Clase para realizar predicciones y generar Grad-CAM usando el modelo entrenado.
"""

import numpy as np
import tensorflow as tf
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from tensorflow.keras.preprocessing import image as keras_image


class CancerPredict:
        
    def __init__(self, model_path, img_size=(96, 96), last_conv_layer_name="last_conv"):
        self.model_path = Path(model_path)
        self.img_size = img_size
        self.last_conv_layer_name = last_conv_layer_name
        self.grad_model = None

        print("Cargando modelo...")
        self.model = tf.keras.models.load_model(model_path)

        # 🔹 Forzar inicialización del modelo (pasada dummy)
        dummy_input = tf.zeros((1, *self.img_size, 3), dtype=tf.float32)
        _ = self.model(dummy_input)
        print("Modelo inicializado correctamente.")



    
    def _load_model(self):
        """Carga el modelo entrenado."""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"No se encuentra el modelo en: {self.model_path}\n"
                "Asegúrate de haber entrenado el modelo primero ejecutando main()."
            )
        
        print(f"⚡ Cargando modelo desde: {self.model_path}")
        self.model = tf.keras.models.load_model(str(self.model_path))
        print(" Modelo cargado exitosamente")
    
    def _build_grad_model(self):
        """
        Construye el modelo de gradientes una sola vez al inicializar.
        Esto optimiza el rendimiento para backends.
        """
        # Construir el modelo haciendo una predicción dummy
        dummy_input = np.zeros((1, *self.img_size, 3), dtype=np.float32)
        _ = self.model.predict(dummy_input, verbose=0)
        
        # Obtener la última capa convolucional
        last_conv_layer = self.model.get_layer(self.last_conv_layer_name)
        
        # Crear modelo funcional para Grad-CAM (se reutiliza)
        self.grad_model = tf.keras.Model(
            inputs=self.model.input,
            outputs=[last_conv_layer.output, self.model.output]
        )
        print("Modelo Grad-CAM construido y listo para usar")
    
    def _preprocess_image(self, img_path):
        """
        Preprocesa una imagen para el modelo.
        
        Args:
            img_path: Ruta a la imagen
            
        Returns:
            img_array: Array de imagen normalizado (1, 96, 96, 3)
        """
        if not Path(img_path).exists():
            raise FileNotFoundError(f"No se encuentra la imagen: {img_path}")
        
        img = keras_image.load_img(img_path, target_size=self.img_size)
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalizar [0, 1]
        
        return img_array
    
    def predict(self, img_path, verbose=True):
        """
        Realiza predicción sobre una imagen.
        
        Args:
            img_path: Ruta a la imagen
            verbose: Si True, imprime resultados detallados
            
        Returns:
            dict: Diccionario con 'prediction', 'classification', 'confidence', 'raw_score'
        """
        # Preprocesar imagen
        img_array = self._preprocess_image(img_path)
        
        # Realizar predicción
        prediction = self.model.predict(img_array, verbose=0)[0][0]
        
        # Interpretar resultados
        pred_class = "CÁNCER" if prediction > 0.5 else "NO CÁNCER"
        confidence = prediction if prediction > 0.5 else 1 - prediction
        
        resultado = {
            'prediction': prediction,
            'classification': pred_class,
            'confidence': confidence,
            'raw_score': float(prediction),
            'has_cancer': prediction > 0.5
        }
        
        if verbose:
            print(f"\n{'='*60}")
            print(f"PREDICCIÓN PARA: {Path(img_path).name}")
            print(f"{'='*60}")
            print(f"Clase predicha: {resultado['classification']} - Confianza: {resultado['confidence']}")
            print(f"   Confianza: {confidence:.2%}")
            print(f"   Score bruto: {prediction:.4f}")
            print(f"{'='*60}\n")
        
        return {
            "classification": pred_class,
            "confidence": float(confidence),
            "score": float(prediction),
            "label": int(prediction > 0.5),
            "images": None  # por compatibilidad con el backend
        }

    
    def _make_gradcam_heatmap(self, img_array):
        """
        Genera el heatmap Grad-CAM usando el modelo pre-construido.
        
        Args:
            img_array: Array de imagen preprocesado
            
        Returns:
            heatmap: Mapa de calor normalizado
        """
        # Calcular gradientes usando el modelo pre-construido
        with tf.GradientTape() as tape:
            conv_outputs, predictions = self.grad_model(img_array)
            loss = predictions[:, 0]
        
        # Gradiente de la predicción respecto a las activaciones
        grads = tape.gradient(loss, conv_outputs)
        
        # Importancia promedio de cada filtro (Global Average Pooling)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Ponderar las activaciones por su importancia
        conv_outputs = conv_outputs[0].numpy()
        pooled_grads = pooled_grads.numpy()
        
        # Multiplicar cada canal por su importancia
        for i in range(pooled_grads.shape[0]):
            conv_outputs[:, :, i] *= pooled_grads[i]
        
        # Crear heatmap promediando todos los canales
        heatmap = np.mean(conv_outputs, axis=-1)
        
        # Normalizar entre 0 y 1
        heatmap = np.maximum(heatmap, 0)
        if np.max(heatmap) != 0:
            heatmap /= np.max(heatmap)
        
        return heatmap
    
    def _superimpose_gradcam(self, img_path, heatmap, alpha=0.4):
        """
        Superpone el heatmap sobre la imagen original.
        
        Args:
            img_path: Ruta a la imagen original
            heatmap: Mapa de calor de Grad-CAM
            alpha: Transparencia del heatmap (0-1)
            
        Returns:
            tuple: (imagen_original, heatmap_resized, imagen_superpuesta)
        """
        # Cargar imagen original
        img = keras_image.load_img(img_path)
        img = keras_image.img_to_array(img)
        
        # Redimensionar heatmap al tamaño original de la imagen
        heatmap_resized = tf.image.resize(
            heatmap[..., np.newaxis],
            (img.shape[0], img.shape[1])
        ).numpy().squeeze()
        
        # Aplicar colormap jet
        heatmap_uint8 = np.uint8(255 * heatmap_resized)
        jet = cm.get_cmap("jet")
        jet_colors = jet(np.arange(256))[:, :3]
        jet_heatmap = jet_colors[heatmap_uint8] * 255
        
        # Superponer
        superimposed = jet_heatmap * alpha + img * (1 - alpha)
        superimposed = np.clip(superimposed, 0, 255).astype(np.uint8)
        
        return img, heatmap_resized, superimposed
    
    def generate_gradcam(self, img_path, save_path=None, alpha=0.4, show_plot=True):
        """
        Genera visualización completa de Grad-CAM para una imagen.
        
        Args:
            img_path: Ruta a la imagen
            save_path: Ruta donde guardar la visualización (opcional)
            alpha: Transparencia del heatmap (default: 0.4)
            show_plot: Si True, muestra el plot (default: True)
            
        Returns:
            dict: Diccionario con 'prediction', 'heatmap', 'save_path'
        """
        print(f"\n{'='*60}")
        print(f"GENERANDO GRAD-CAM PARA: {Path(img_path).name}")
        print(f"{'='*60}")
        
        # Realizar predicción
        resultado = self.predict(img_path, verbose=False)
        
        # Preprocesar imagen
        img_array = self._preprocess_image(img_path)
        
        # Generar heatmap
        print("Generando mapa de atención Grad-CAM...")
        heatmap = self._make_gradcam_heatmap(img_array)
        
        # Superponer sobre imagen
        original, heatmap_resized, superimposed = self._superimpose_gradcam(
            img_path, heatmap, alpha
        )
        
        # Crear visualización
        fig, axes = plt.subplots(1, 3, figsize=(18, 6))
        
        # Imagen original
        axes[0].imshow(original.astype(np.uint8))
        axes[0].set_title("Imagen Original", fontsize=14, fontweight='bold')
        axes[0].axis('off')
        
        # Heatmap
        im = axes[1].imshow(heatmap_resized, cmap='jet')
        axes[1].set_title("Mapa de Atención Grad-CAM", fontsize=14, fontweight='bold')
        axes[1].axis('off')
        plt.colorbar(im, ax=axes[1], fraction=0.046, pad=0.04)
        
        # Superposición
        axes[2].imshow(superimposed.astype(np.uint8))
        axes[2].set_title(
            f"Superposición\n{resultado['classification']} ({resultado['confidence']:.1%})",
            fontsize=14,
            fontweight='bold'
        )
        axes[2].axis('off')
        
        # Título general
        fig.suptitle(
            f"Análisis Grad-CAM - {Path(img_path).name}",
            fontsize=16,
            fontweight='bold',
            y=0.98
        )
        
        plt.tight_layout()
        
        # Guardar si se especifica ruta
        if save_path:
            save_path = Path(save_path)
            save_path.parent.mkdir(parents=True, exist_ok=True)
            plt.savefig(save_path, dpi=150, bbox_inches='tight')
            print(f"Visualización guardada en: {save_path}")
        
        # Mostrar plot
        if show_plot:
            plt.show()
        else:
            plt.close()
        
        return {
            'prediction': resultado,
            'heatmap': heatmap,
            'save_path': save_path if save_path else None
        }
    
    def batch_predict(self, image_paths, verbose=True):
        """
        Realiza predicciones sobre múltiples imágenes.
        
        Args:
            image_paths: Lista de rutas a imágenes
            verbose: Si True, imprime progreso
            
        Returns:
            list: Lista de diccionarios con resultados
        """
        resultados = []
        
        for i, img_path in enumerate(image_paths, 1):
            if verbose:
                print(f"\n[{i}/{len(image_paths)}] Procesando: {Path(img_path).name}")
            
            try:
                resultado = self.predict(img_path, verbose=False)
                resultados.append({
                    'image_path': img_path,
                    **resultado
                })
            except Exception as e:
                print(f"Error procesando {img_path}: {e}")
                resultados.append({
                    'image_path': img_path,
                    'error': str(e)
                })
        
        if verbose:
            self._print_batch_summary(resultados)
        
        return resultados
    
    def _print_batch_summary(self, resultados):
        """Imprime resumen de predicciones en lote."""
        print(f"\n{'='*60}")
        print("RESUMEN DE PREDICCIONES")
        print(f"{'='*60}")
        
        total = len(resultados)
        con_cancer = sum(1 for r in resultados if r.get('has_cancer', False))
        sin_cancer = total - con_cancer
        
        print(f"Total de imágenes: {total}")
        print(f"Con cáncer: {con_cancer} ({con_cancer/total*100:.1f}%)")
        print(f"Sin cáncer: {sin_cancer} ({sin_cancer/total*100:.1f}%)")
        print(f"{'='*60}\n")
        
    def generate_gradcam_separated(self, img_path, save_dir=None):
        """
        Genera las 3 imágenes Grad-CAM por separado (original, heatmap, superimposed).
        Retorna las imágenes en base64 para enviar al frontend.
        
        Args:
            img_path: Ruta a la imagen de entrada
            save_dir: Directorio donde guardar las imágenes (opcional)
        
        Returns:
            dict: {
                'original_base64': str,
                'heatmap_base64': str, 
                'superimposed_base64': str,
                'prediction': dict,
                'saved_paths': dict (si save_dir está especificado)
            }
        """
        import io
        import base64
        from PIL import Image
        
        print(f"\n{'='*60}")
        print(f"GENERANDO GRAD-CAM SEPARADO PARA: {Path(img_path).name}")
        print(f"{'='*60}")
        
        # Realizar predicción
        resultado = self.predict(img_path, verbose=False)
        
        # Preprocesar imagen
        img_array = self._preprocess_image(img_path)
        
        # Generar heatmap
        print(" Generando mapa de atención Grad-CAM...")
        heatmap = self._make_gradcam_heatmap(img_array)
        
        # Superponer sobre imagen
        original, heatmap_resized, superimposed = self._superimpose_gradcam(
            img_path, heatmap, alpha=0.4
        )
        
        # Convertir cada imagen a base64
        def img_to_base64(img_array):
            """Convierte array numpy a base64"""
            img_pil = Image.fromarray(img_array.astype(np.uint8))
            buffer = io.BytesIO()
            img_pil.save(buffer, format='PNG')
            buffer.seek(0)
            return base64.b64encode(buffer.read()).decode('utf-8')
        
        def heatmap_to_base64(heatmap_array):
            """Convierte heatmap a imagen RGB con colormap y luego a base64"""
            # Normalizar heatmap
            heatmap_uint8 = np.uint8(255 * heatmap_array)
            
            # Aplicar colormap jet
            jet = cm.get_cmap("jet")
            jet_colors = jet(np.arange(256))[:, :3]
            jet_heatmap = jet_colors[heatmap_uint8] * 255
            
            # Redimensionar al tamaño de la imagen original
            img = keras_image.load_img(img_path)
            img_array = keras_image.img_to_array(img)
            
            heatmap_resized = tf.image.resize(
                jet_heatmap[..., np.newaxis] if len(jet_heatmap.shape) == 2 else jet_heatmap,
                (img_array.shape[0], img_array.shape[1])
            ).numpy()
            
            if len(heatmap_resized.shape) == 3 and heatmap_resized.shape[2] == 1:
                heatmap_resized = heatmap_resized.squeeze()
            
            return img_to_base64(heatmap_resized)
        
        # Convertir las 3 imágenes
        original_b64 = img_to_base64(original)
        heatmap_b64 = heatmap_to_base64(heatmap)
        superimposed_b64 = img_to_base64(superimposed)
        
        print(" Imágenes Grad-CAM generadas en base64")
        
        result = {
            'original_base64': original_b64,
            'heatmap_base64': heatmap_b64,
            'superimposed_base64': superimposed_b64,
            'prediction': resultado
        }
        
        # Guardar imágenes en disco si se especifica save_dir
        if save_dir:
            save_path = Path(save_dir)
            save_path.mkdir(parents=True, exist_ok=True)
            
            # Obtener nombre base del archivo
            base_name = Path(img_path).stem
            
            # Guardar las 3 imágenes
            original_path = save_path / f"{base_name}_original.png"
            heatmap_path = save_path / f"{base_name}_heatmap.png"
            superimposed_path = save_path / f"{base_name}_superimposed.png"
            
            # Guardar original
            Image.fromarray(original.astype(np.uint8)).save(original_path)
            
            # Guardar heatmap (necesita reconversión)
            heatmap_uint8 = np.uint8(255 * heatmap)
            jet = cm.get_cmap("jet")
            jet_colors = jet(np.arange(256))[:, :3]
            jet_heatmap = jet_colors[heatmap_uint8] * 255
            
            img = keras_image.load_img(img_path)
            img_array = keras_image.img_to_array(img)
            
            heatmap_resized_save = tf.image.resize(
                jet_heatmap[..., np.newaxis] if len(jet_heatmap.shape) == 2 else jet_heatmap,
                (img_array.shape[0], img_array.shape[1])
            ).numpy()
            
            if len(heatmap_resized_save.shape) == 3 and heatmap_resized_save.shape[2] == 1:
                heatmap_resized_save = heatmap_resized_save.squeeze()
            
            Image.fromarray(heatmap_resized_save.astype(np.uint8)).save(heatmap_path)
            
            # Guardar superimposed
            Image.fromarray(superimposed.astype(np.uint8)).save(superimposed_path)
            
            print(f" Imágenes guardadas en:")
            print(f"   - {original_path}")
            print(f"   - {heatmap_path}")
            print(f"   - {superimposed_path}")
            
            result['saved_paths'] = {
                'original': str(original_path),
                'heatmap': str(heatmap_path),
                'superimposed': str(superimposed_path)
            }
        
        return result


# ================================
# EJEMPLOS DE USO
# ================================
if __name__ == "__main__":
    # Ejemplo 1: Predicción simple
    print("Ejemplo 1: Predicción simple")
    print("-" * 60)
    
    predictor = CancerPredict("output_gradcam/cancer_model.keras")
    
    # Ruta de ejemplo (REEMPLAZA con tu imagen)
    imagen_ejemplo = "ruta/a/tu/imagen.png"
    
    # Realizar predicción
    resultado = predictor.predict(imagen_ejemplo)
    print(f"Clase predicha: {resultado['classification']}")
    print(f"Confianza: {resultado['confidence']:.2%}")
    
    # ================================
    # Ejemplo 2: Generar Grad-CAM
    print("\n\nEjemplo 2: Generar Grad-CAM")
    print("-" * 60)
    
    gradcam_result = predictor.generate_gradcam(
        img_path=imagen_ejemplo,
        save_path="output_gradcam/mi_analisis.png",
        alpha=0.4,
        show_plot=True
    )
    
    # ================================
    # Ejemplo 3: Predicción en lote
    print("\n\nEjemplo 3: Predicción en lote")
    print("-" * 60)
    
    imagenes = [
        "ruta/imagen1.png",
        "ruta/imagen2.png",
        "ruta/imagen3.png"
    ]
    
    resultados = predictor.batch_predict(imagenes)
    
    # Acceder a resultados individuales
    for r in resultados:
        if 'error' not in r:
            print(f"{Path(r['image_path']).name}: {r['classification']} ({r['confidence']:.1%})")