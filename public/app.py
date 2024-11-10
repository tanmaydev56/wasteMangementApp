import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the TensorFlow model in Keras format
model_path = 'h5format_model.h5'
model = tf.keras.models.load_model(model_path)

# Define a dictionary for class-category mapping
class_category_map = {
    0: "Cardboard",
    1: "Compost",
    2: "Glass",
    3: "Metal",
    4: "Paper",
    5:"Plastic",
    6:"Trash"
    # Add more categories as needed based on model classes
}

def preprocess_image(image):
    """Resize and scale the image as required by the model (e.g., 224x224 for MobileNet)."""
    image = image.resize((224, 224))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    image /= 255.0  # Scale pixel values to [0, 1]
    return image

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Read and preprocess the image
    image = Image.open(io.BytesIO(file.read()))
    processed_image = preprocess_image(image)

    # Make prediction
    predictions = model.predict(processed_image)
    top_prediction = np.argmax(predictions[0])
    category = class_category_map.get(top_prediction, "Unknown")

    return jsonify({
        "prediction": int(top_prediction),
        "category": category,
        "confidence": float(predictions[0][top_prediction])
    })

if __name__ == "__main__":
    app.run(debug=True)
