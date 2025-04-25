import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle

# Load Titanic dataset
df = pd.read_csv('https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv')

# Select only 7 features and drop rows with missing values
df = df[['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked', 'Survived']].dropna()

# Encode categorical columns
df['Sex'] = LabelEncoder().fit_transform(df['Sex'])  # male = 1, female = 0
df['Embarked'] = df['Embarked'].map({'C': 0, 'Q': 1, 'S': 2})

# Split features and label
X = df.drop('Survived', axis=1)
y = df['Survived']

# Scale Age and Fare
scaler = StandardScaler()
X[['Age', 'Fare']] = scaler.fit_transform(X[['Age', 'Fare']])

# Train-test split for accuracy check
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train SVM
model = SVC(kernel='rbf', C=10, gamma=0.1)
model.fit(X_train, y_train)

# Accuracy & classification report
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)

print(f"✅ Accuracy: {accuracy:.4f}")
print("📊 Classification Report:\n", report)

# Save model and scaler
pickle.dump(model, open('model.pkl', 'wb'))
pickle.dump(scaler, open('scaler.pkl', 'wb'))
