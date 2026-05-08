import os
import pickle
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
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

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42
    )

    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    classifier = MultinomialNB()
    classifier.fit(X_train_vec, y_train)

    y_pred = classifier.predict(X_test_vec)
    print("=== CATEGORY CLASSIFIER ===")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Re-train on ALL data before saving (so production model uses everything)
    full_vec = vectorizer.fit_transform(texts)
    classifier.fit(full_vec, labels)

    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)

    with open(CATEGORY_VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    with open(CATEGORY_MODEL_PATH, "wb") as f:
        pickle.dump(classifier, f)

    return classifier


def train_priority_classifier():
    texts, labels = split_texts_and_labels(PRIORITY_TRAINING_DATA)

    X_train, X_test, y_train, y_test = train_test_split(
        texts, labels, test_size=0.2, random_state=42
    )

    vectorizer = TfidfVectorizer()
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    classifier = MultinomialNB()
    classifier.fit(X_train_vec, y_train)

    y_pred = classifier.predict(X_test_vec)
    print("=== PRIORITY CLASSIFIER ===")
    print(classification_report(y_test, y_pred))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Re-train on ALL data before saving
    full_vec = vectorizer.fit_transform(texts)
    classifier.fit(full_vec, labels)

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
    probabilities = classifier.predict_proba(vector)[0]
    
    sorted_probs = sorted(probabilities, reverse=True)
    best_prob = sorted_probs[0]
    second_prob = sorted_probs[1]
    
    category = classifier.predict(vector)[0]
    
    # confidence = how much better best is compared to second best
    relative_confidence = best_prob - second_prob

    return category, relative_confidence

    
def predict_priority(text):
    with open(PRIORITY_VECTORIZER_PATH, "rb") as f:
        vectorizer = pickle.load(f)

    with open(PRIORITY_MODEL_PATH, "rb") as f:
        classifier = pickle.load(f)

    vector = vectorizer.transform([text])
    priority = classifier.predict(vector)[0]
    confidence = classifier.predict_proba(vector).max()

    return priority, confidence