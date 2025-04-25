from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (frontend can talk to backend)

# Load the trained model and scaler
model = pickle.load(open('model.pkl', 'rb'))
scaler = pickle.load(open('scaler.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    # Get input data from the request (frontend sends data in JSON format)
    data = request.get_json()

    # Extract and preprocess features from the data
    sex = 1 if data['Sex'] == 'male' else 0
    embarked = {'C': 0, 'Q': 1, 'S': 2}.get(data['Embarked'], 2)

    features = [
        int(data['Pclass']),
        sex,
        float(data['Age']),
        int(data['SibSp']),
        int(data['Parch']),
        float(data['Fare']),
        embarked
    ]

    # Scale Age and Fare using the trained scaler
    scaled = scaler.transform([[features[2], features[5]]])[0]
    features[2], features[5] = scaled[0], scaled[1]

    # Use the model to make a prediction
    prediction = model.predict([features])[0]

    # Return the prediction as a JSON response
    return jsonify({'prediction': int(prediction)})

if __name__ == '__main__':
    app.run(debug=True)
