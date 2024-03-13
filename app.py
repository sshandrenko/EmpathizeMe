from flask import Flask, request, jsonify
from models import db, User, Post, Comment
from config import Config
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

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
