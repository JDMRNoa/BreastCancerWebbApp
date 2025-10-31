import requests
import base64
from pathlib import Path

# Configuraciónyyy
API_URL = "http://127.0.0.1:5000"
IMG_PATH = r"C:\Users\User\.cache\kagglehub\datasets\paultimothymooney\breast-histopathology-images\versions\1\IDC_regular_ps50_idx5\9036\0\9036_idx5_x51_y1701_class0.png"  # <-- Cambia esto por tu imagen de prueba

def test_analyze():
    """Prueba el endpoint /analyze"""
    print("\n=== TEST /analyze ===")
    if not Path(IMG_PATH).exists():
        print(f" La imagen '{IMG_PATH}' no existe.")
        return

    with open(IMG_PATH, "rb") as f:
        files = {"file": (Path(IMG_PATH).name, f, "image/png")}
        res = requests.post(f"{API_URL}/analyze", files=files)

    if res.status_code == 200:
        data = res.json()
        print(" Predicción correcta:")
        print(f"  - Clasificación: {data.get('classification')}")
        print(f"  - Confianza: {data.get('confidence')}")
        print(f"  - Score: {data.get('score')}")
        print(f"  - Label: {data.get('label')}")
    else:
        print(f" Error ({res.status_code}): {res.text}")


def test_gradcam():
    """Prueba el endpoint /gradcam"""
    print("\n=== TEST /gradcam ===")
    if not Path(IMG_PATH).exists():
        print(f" La imagen '{IMG_PATH}' no existe.")
        return

    with open(IMG_PATH, "rb") as f:
        files = {"file": (Path(IMG_PATH).name, f, "image/png")}
        res = requests.post(f"{API_URL}/gradcam", files=files)

    if res.status_code == 200:
        data = res.json()
        print(" Grad-CAM generado correctamente")
        print(f"  - Ruta: {data.get('heatmap_path')}")
        heatmap_b64 = data.get("heatmap_base64")

        # Guardar el heatmap en archivo temporal (para verificar visualmente)
        if heatmap_b64:
            heatmap_bytes = base64.b64decode(heatmap_b64)
            out_path = Path("heatmap_test.png")
            out_path.write_bytes(heatmap_bytes)
            print(f"  - Imagen guardada en: {out_path.resolve()}")
        else:
            print(" No se recibió el heatmap en base64.")
    else:
        print(f" Error ({res.status_code}): {res.text}")


if __name__ == "__main__":
    test_analyze()
    test_gradcam()
