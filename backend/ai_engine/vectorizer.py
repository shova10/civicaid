import os
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from ai_engine.training_data import CATEGORY_TRAINING_DATA

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAVED_MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
VECTORIZER_PATH = os.path.join(SAVED_MODELS_DIR, "vectorizer.pkl")


def train_vectorizer():
    texts = [item[0] for item in CATEGORY_TRAINING_DATA]

    vectorizer = TfidfVectorizer()
    vectorizer.fit(texts)

    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    return vectorizer


def load_vectorizer():
    with open(VECTORIZER_PATH, "rb") as f:
        return pickle.load(f)


def vectorize(text):
    vectorizer = load_vectorizer()
    return vectorizer.transform([text])

    