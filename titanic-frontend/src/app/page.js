'use client';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [form, setForm] = useState({
    Pclass: 1,
    Sex: 'male',
    Age: '',
    SibSp: 0,
    Parch: 0,
    Fare: '',
    Embarked: 'S',
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/predict', form);
      setPrediction(res.data.prediction);
      alert(res.data.prediction === 1 ? 'Survived 🟢' : 'Did Not Survive 🔴');
    } catch (error) {
      console.error('Prediction error:', error);
      alert('⚠️ Error connecting to backend');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🚢 Titanic Survival Predictor</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Pclass (1/2/3)', name: 'Pclass', type: 'number' },
            { label: 'Sex', name: 'Sex', type: 'select', options: ['male', 'female'] },
            { label: 'Age', name: 'Age', type: 'number' },
            { label: 'Siblings/Spouses (SibSp)', name: 'SibSp', type: 'number' },
            { label: 'Parents/Children (Parch)', name: 'Parch', type: 'number' },
            { label: 'Fare', name: 'Fare', type: 'number' },
            { label: 'Embarked', name: 'Embarked', type: 'select', options: ['C', 'Q', 'S'] },
          ].map(({ label, name, type, options }) => (
            <div key={name}>
              <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
              {type === 'select' ? (
                <select
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Predict
          </button>
        </form>

        {prediction !== null && (
          <div className="mt-6 text-center text-lg">
            <span className="font-semibold text-black">Prediction:</span>{' '}
            <span
              className={`font-bold ${
                prediction === 1 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {prediction === 1 ? 'Survived 🟢' : 'Did Not Survive 🔴'}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
