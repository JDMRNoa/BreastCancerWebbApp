from backend_api import create_app
from cancer_predict_class import CancerPredict

MODEL_PATH = "model/cancer_model_flat.keras"

def main():
    print("Cargando modelo...")
    predictor = CancerPredict(MODEL_PATH)
    print("Modelo inicializado correctamente.")

    app = create_app()
    print("Servidor Flask inicializado.")
    app.run(host="0.0.0.0", port=5000, debug=False)

if __name__ == "__main__":
    main()
