from flask import Flask, request, jsonify, session, redirect, render_template
from models import db, User, Post, Comment
from config import Config
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

# Routes for user registration and login

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if username and password are provided
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    # Hash the password
    password_hash = generate_password_hash(password)

    # Create a new user
    new_user = User(username=username, password_hash=password_hash)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if username and password are provided
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    # Find the user by username
    user = User.query.filter_by(username=username).first()

    # Check if user exists and password is correct
    if user and check_password_hash(user.password_hash, password):
        session['username'] = username
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# Your existing routes for creating posts and comments remain unchanged

@app.route('/post', methods=['POST'])
def create_post():
    data = request.json
    new_post = Post(content=data['content'], user_id=data['user_id'])
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'message': 'Post created successfully'}), 201

@app.route('/comment', methods=['POST'])
def post_comment():
    data = request.json
    new_comment = Comment(content=data['content'], user_id=data['user_id'], post_id=data['post_id'])
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({'message': 'Comment posted successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
