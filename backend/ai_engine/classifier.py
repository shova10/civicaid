import os
import pickle
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from ai_engine.training_data import CATEGORY_TRAINING_DATA, PRIORITY_TRAINING_DATA
from ai_engine.vectorizer import SAVED_MODELS_DIR

CATEGORY_VECTORIZER_PATH = os.path.join(SAVED_MODELS_DIR, "category_vectorizer.pkl")
CATEGORY_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "category_classifier.pkl")

PRIORITY_VECTORIZER_PATH = os.path.join(SAVED_MODELS_DIR, "priority_vectorizer.pkl")
PRIORITY_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "priority_classifier.pkl")


def split_texts_and_labels(data):
    texts = [item[0] for item in data]
    labels = [item[1] for item in data]
    return texts, labels


def train_category_classifier():
    texts, labels = split_texts_and_labels(CATEGORY_TRAINING_DATA)

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(texts)

    classifier = MultinomialNB()
    classifier.fit(vectors, labels)

    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

    with open(CATEGORY_VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    with open(CATEGORY_MODEL_PATH, "wb") as f:
        pickle.dump(classifier, f)

    return classifier


def train_priority_classifier():
    texts, labels = split_texts_and_labels(PRIORITY_TRAINING_DATA)

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(texts)

    classifier = MultinomialNB()
    classifier.fit(vectors, labels)

    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

    with open(PRIORITY_VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    with open(PRIORITY_MODEL_PATH, "wb") as f:
        pickle.dump(classifier, f)

    return classifier


def predict_category(text):
    with open(CATEGORY_VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)

    with open(CATEGORY_MODEL_PATH, "rb") as f:
        classifier = pickle.load(f)

    vector = vectorizer.transform([text])
    category = classifier.predict(vector)[0]
    confidence = classifier.predict_proba(vector).max()

    return category, confidence


def predict_priority(text):
    with open(PRIORITY_VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)

    with open(PRIORITY_MODEL_PATH, "rb") as f:
        classifier = pickle.load(f)

    vector = vectorizer.transform([text])
    priority = classifier.predict(vector)[0]
    confidence = classifier.predict_proba(vector).max()

    return priority, confidence