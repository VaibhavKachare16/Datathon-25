from flask import Blueprint, jsonify

views = Blueprint('views', __name__)

@views.route("/hello")
def test():
    print("Access")
    return jsonify({"data": "Hello from Flask!"}), 200