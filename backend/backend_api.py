from flask import Flask, request, jsonify
from pathlib import Path
import base64
import os
import tensorflow as tf
from cancer_predict_class import CancerPredict
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 


# Asegurar carpeta de salida
OUTPUT_DIR = Path("output_gradcam")
OUTPUT_DIR.mkdir(exist_ok=True)

# Cargar modelo
MODEL_PATH = "model/cancer_model_flat.keras"
predictor = CancerPredict(MODEL_PATH)
try:
    # Forzar construcción con la forma de entrada del modelo
    predictor.model.build((None, 96, 96, 3))
except Exception:
    pass




@app.route("/analyze", methods=["POST"])
def analyze_image():
    """Analiza una imagen y devuelve el resultado del modelo"""
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No se envió ningún archivo"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"success": False, "message": "Archivo sin nombre"}), 400

    # Guardar temporalmente la imagen
    temp_path = OUTPUT_DIR / file.filename
    file.save(temp_path)

    try:
        resultado = predictor.predict(str(temp_path))

        # Adaptar a claves reales del modelo
        response = {
            "success": True,
            "message": "Predicción realizada correctamente",
            "classification": resultado.get("classification"),
            "confidence": resultado.get("confidence"),
            "score": resultado.get("score"),
            "label": resultado.get("label"),
            "images": resultado.get("images"),
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Error en la predicción: {e}"}), 500

    finally:
        if temp_path.exists():
            temp_path.unlink()

@app.route("/gradcam", methods=["POST"])
def generate_gradcam():
    """Genera y devuelve el heatmap Grad-CAM de una imagen"""

    # --- Preparar grad_model y detectar capa correcta ---
    if getattr(predictor, "grad_model", None) is None:
        predictor._build_grad_model()

    # --- Validar archivo ---
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No se envió ningún archivo"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"success": False, "message": "Archivo sin nombre"}), 400

    temp_path = OUTPUT_DIR / file.filename
    file.save(temp_path)

    try:
        # Usar el método de la clase CancerPredict y guardar las imágenes
        result = predictor.generate_gradcam_separated(
            str(temp_path),
            save_dir="output_gradcam/saved_images"  # Guardar en esta carpeta
        )

        return jsonify({
            "success": True,
            "message": "Grad-CAM generado correctamente",
            "original_base64": result['original_base64'],
            "heatmap_base64": result['heatmap_base64'],
            "superimposed_base64": result['superimposed_base64'],
            "saved_paths": result.get('saved_paths')  # Rutas donde se guardaron
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error generando Grad-CAM: {e}"
        }), 500

    finally:
        if temp_path.exists():
            temp_path.unlink()


def create_app():
    """Devuelve la instancia de la app Flask configurada"""
    return app

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)


