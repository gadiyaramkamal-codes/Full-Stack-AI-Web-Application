from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from datetime import datetime, timezone
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017/"
)

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["ai_analysis_db"]
analyses_collection = db["analyses"]

# Initialize sentiment analyzer
analyzer = SentimentIntensityAnalyzer()


# Home API
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Full-Stack AI Web Application Backend is running!"
    })


# Backend Health API
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "backend": "Flask"
    })


# MongoDB Health API
@app.route("/api/db-health", methods=["GET"])
def database_health():
    try:
        client.admin.command("ping")
        return jsonify({
            "status": "success",
            "database": "MongoDB",
            "database_name": "ai_analysis_db",
            "message": "MongoDB connected successfully!"
        })
    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Sentiment Analysis API
@app.route("/api/sentiment", methods=["POST"])
def sentiment_analysis():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    if not isinstance(text, str) or not text.strip():
        return jsonify({
            "status": "error",
            "message": "Please provide valid text."
        }), 400

    # Analyze sentiment
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    # Save result in MongoDB
    result = {
        "text": text.strip(),
        "sentiment": sentiment,
        "scores": scores,
        "created_at": datetime.now(timezone.utc)
    }

    try:
        saved = analyses_collection.insert_one(result)

        return jsonify({
            "status": "success",
            "sentiment": sentiment,
            "scores": scores,
            "record_id": str(saved.inserted_id),
            "message": "Sentiment analysis completed and saved!"
        }), 200

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": f"Database error: {str(error)}"
        }), 500


# Sentiment Analysis History API
@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        records = analyses_collection.find().sort(
            "created_at", -1
        ).limit(20)

        history = []

        for record in records:
            history.append({
                "id": str(record["_id"]),
                "text": record.get("text", ""),
                "sentiment": record.get("sentiment", "Unknown"),
                "scores": record.get("scores", {}),
                "created_at": (
                    record["created_at"].isoformat()
                    if record.get("created_at")
                    else None
                )
            })

        return jsonify({
            "status": "success",
            "count": len(history),
            "history": history
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)