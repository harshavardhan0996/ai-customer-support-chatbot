from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

conversation_history = []

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful customer support assistant."
                },
                *conversation_history
            ]
        )
        
        assistant_message = response.choices[0].message.content
        
        conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return jsonify({
            "response": assistant_message,
            "status": "success"
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "running"})

@app.route('/clear', methods=['POST'])
def clear_history():
    conversation_history.clear()
    return jsonify({"status": "cleared"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)