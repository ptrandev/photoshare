# ----------- #
# - IMPORTS - #
# ----------- #

# Base Imports
import base64
import os
import shutil
import time

# Flask Imports
import flask
from flask import Flask, Response, request, render_template, redirect, url_for, jsonify, send_file
from flaskext.mysql import MySQL
from pymysql.cursors import DictCursor
import flask_login
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone

# ENVIRONMENT VARIABLES
from dotenv import load_dotenv
import json
load_dotenv()


# ----------------- #
# - CONFIGURATION - #
# ----------------- #

# CORS SETTINGS
mysql = MySQL(cursorclass=DictCursor)
app = Flask(__name__)
cors = CORS(app, supports_credentials = True)
app.secret_key = 'DeltaEchoEchoZuluNovemberUniformTangoSierra'

# SQL CONFIGURATION
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('password')
app.config['MYSQL_DATABASE_DB'] = 'photoshare'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

# ACCESS TOKEN
app.config["JWT_SECRET_KEY"] = "DeltaEchoEchoZuluNovemberUniformTangoSierra"
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False

# LOGIN SETTINGS
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
conn = mysql.connect()
cursor = conn.cursor()
cursor.execute("SELECT email from Users")
users = cursor.fetchall()


# ----------------- #
# - LOGIN MANAGER - #
# ----------------- #

class User(flask_login.UserMixin):
    pass

@login_manager.user_loader
def user_loader(email):
    users = getUserList()
    if not(email) or email not in str(users):
        return
    user = User()
    user.id = email
    return user

@login_manager.request_loader
def request_loader(request):
    users = getUserList()
    email = request.form.get('email')
    if not(email) or email not in str(users):
        return
    user = User()
    user.id = email
    cursor = mysql.connect().cursor()
    cursor.execute(
        f"SELECT password FROM Users WHERE email = '{email}'")
    data = cursor.fetchall()
    pwd = str(data[0][0])
    user.is_authenticated = request.form['password'] == pwd
    return user

def getUserList():
    cursor = conn.cursor()
    cursor.execute("SELECT email from Users")
    return cursor.fetchall()

def getUsersPhotos(uid):
    cursor = conn.cursor()
    cursor.execute(
        f"SELECT imgdata, picture_id, caption FROM Pictures WHERE user_id = '{uid}'")
    # NOTE return a list of tuples, [(imgdata, pid, caption), ...]
    return cursor.fetchall()

def getUserIdFromEmail(email):
    cursor = conn.cursor()
    cursor.execute(
        f"SELECT user_id  FROM Users WHERE email = '{email}'")
    return cursor.fetchone()[0]

def isEmailUnique(email):
    # use this to check if a email has already been registered
    cursor = conn.cursor()
    if cursor.execute(f"SELECT email FROM Users WHERE email = '{email}'"):
        # this means there are greater than zero entries with that email
        return False
    else:
        return True


# ------------------ #
# - PROFILE ROUTER - #
# ------------------ #

# DISPLAY USER PROFILE
@app.route('/profile')
@jwt_required()
def protected():
    return render_template('hello.html', name=flask_login.current_user.id, message="Here's your profile")


# ---------------- #
# - LOGIN ROUTER - #
# ---------------- #

# LOGIN TO USER
@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if cursor.execute(f"SELECT password FROM Users WHERE email = '{email}'"):
        data = cursor.fetchone()
        pwd = str(data['password'])
        if password == pwd:
            access_token = create_access_token(identity=email)
            response = {"access_token": access_token}
            return response

    return {"msg": "Wrong email or password"}, 401

# LOGOUT OF USER
@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

# JWT TOKEN VALIDATION
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

# REGISTER NEW USER
@app.route("/register", methods=['POST'])
def register():
    # Required information
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        first_name = request.json.get('firstName')
        last_name = request.json.get('lastName')
        dob = request.json.get('dob')
    except:
        # This prints to shell, end users will not see this (all print statements go to shell)
        print("couldn't find all tokens")
        return {"success": False}

    # Additional information
    hometown = request.json.get('hometown')
    gender = request.json.get('gender')
    cursor = conn.cursor()
    test = isEmailUnique(email)
    if test:
        cursor.execute(
            f"INSERT INTO Users (email, password, first_name, last_name, dob, hometown, gender) VALUES ('{email}', '{password}', '{first_name}', '{last_name}', '{dob}', '{hometown}', '{gender}')")
        conn.commit()

        return {"success": True, "message": "Registration succeeded. You can login now."}
    else:
        return {"success": False, "message": "Email already registered. Try again with a different email."}


# ------------------ #
# - FRIENDS ROUTER - #
# ------------------ #

# ADD FRIEND
@app.route('/friends/add', methods=['POST'])
@jwt_required()
def add_friend():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user and friend
    user_id = cursor.fetchone()['user_id']
    friend_id = request.json['friend_id']

    # This is to prevent users from adding themselves as friends.
    if (user_id == friend_id):
        return json.dumps({'success': False, 'message': 'You cannot add yourself as a friend.'})

    # Check if friend is already in friend list
    cursor.execute(f"SELECT * FROM Friends WHERE friend_a = '{user_id}' AND friend_b = '{friend_id}'")

    # If friend is already in friend list, return error
    if cursor.fetchone():
        return json.dumps({'success': False, 'message': 'Friend already in friend list.'})

    # Add friend to current user
    cursor = conn.cursor()
    cursor.execute(
        f"INSERT INTO Friends (friend_a, friend_b) VALUES ('{user_id}', '{friend_id}')")
    cursor.execute(
        f"INSERT INTO Friends (friend_a, friend_b) VALUES ('{friend_id}', '{user_id}')")
    conn.commit()

    return jsonify({"success": True, "message": "Friend added."})

# REMOVE FRIEND
@app.route('/friends/remove', methods=['POST'])
@jwt_required()
def remove_friend():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user and friend
    user_id = cursor.fetchone()['user_id']
    friend_id = request.json['friend_id']

    # Remove friend from current user
    cursor = conn.cursor()
    cursor.execute(
        f"DELETE FROM Friends WHERE friend_a = '{user_id}' AND friend_b = '{friend_id}'")
    cursor.execute(
        f"DELETE FROM Friends WHERE friend_a = '{friend_id}' AND friend_b = '{user_id}'")

    return {"success": True, "message": "Friend removed."}

# SEARCH FOR FRIENDS
@app.route('/friends/search', methods=['GET'])
def search_friends():
    # Get query
    query = [request.args.get('firstName'), request.args.get('lastName')]
    cursor = conn.cursor()

    cursor.execute(
            f"SELECT user_id, first_name, last_name, email FROM Users WHERE first_name LIKE '{query[0]}%' AND last_name LIKE '{query[1]}%'")
    query = cursor.fetchall()
    return jsonify(query)

# LIST USER'S FRIENDS
@app.route('/friends/list', methods=['GET'])
@jwt_required()
def list_friends():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user
    user_id = cursor.fetchone()['user_id']

    # Get friends
    cursor = conn.cursor()
    cursor.execute(
        f"SELECT U.user_id, U.first_name, U.last_name, U.email FROM Friends F JOIN Users U ON U.user_id = F.friend_b WHERE friend_a = '{user_id}'")
    query = cursor.fetchall()

    return jsonify(query)


# ---------------- #
# - ALBUM ROUTER - #
# ---------------- #

# CREATE ALBUM
@app.route('/albums/create', methods=['POST'])
@jwt_required()
def create_album():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids and album name
    user_id = cursor.fetchone()['user_id']
    album_name = request.json['album_name']

    # Check if album already exists
    cursor.execute(
        f"SELECT album_id FROM Albums WHERE user_id={user_id} AND album_name='{album_name}';")
    album_id = cursor.fetchone()

    if album_id:
        return jsonify({"success": False, "message": "Album with that name already exists."})

    # Save album to database
    cursor.execute(
        f"INSERT INTO Albums (user_id, album_name, created) VALUES ('{user_id}', '{album_name}', '{datetime.now()}');")
    conn.commit()
    
    cursor.execute(
        f"SELECT album_id FROM Albums WHERE user_id={user_id} AND album_name='{album_name}';")
    album_id = cursor.fetchone()['album_id']

    return jsonify({"success": True, "message": "Album created.", "album_id": album_id})

# GET IMAGE
@app.route('/imgs', methods=['GET'])
def get_img():
    photo_id = request.args.get('photo_id')
    cursor = conn.cursor()

    cursor.execute(
        f"SELECT photo_id, album_id, caption, data FROM Photos WHERE photo_id={photo_id}")
    img = cursor.fetchone()

    obj = img

    # get number of likes
    cursor.execute(
        f"SELECT COUNT(*) FROM Likes WHERE photo_id={photo_id}")
    obj['num_likes'] = cursor.fetchone()['COUNT(*)']

    # get likes names
    cursor.execute(
        f"SELECT U.first_name, U.last_name FROM Likes L JOIN Users U ON U.user_id = L.user_id WHERE photo_id={photo_id}")
    obj['likes'] = cursor.fetchall()

    # get comments
    cursor.execute(
        f"SELECT first_name, last_name, text FROM Comments c JOIN Users u ON c.user_id=u.user_id WHERE c.photo_id={img['photo_id']} ORDER BY date DESC;")
    comments = cursor.fetchall()
    obj["comments"] = comments
    obj["num_comments"] = len(comments)

    # Get Tags
    cursor.execute(
        f"SELECT t.tag_id, t.tag_name FROM Has_Tag ht JOIN Photos p JOIN Tags t ON t.tag_id=ht.tag_id AND p.photo_id=ht.photo_id where p.photo_id={img['photo_id']};")
    tags = cursor.fetchall()
    obj["tags"] = tags

    return jsonify(obj)

# UPLOAD IMAGE
@app.route('/albums/upload', methods=['POST'])
@jwt_required()
def upload_img():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # # Get ids and album name
    user_id = cursor.fetchone()['user_id']
    album_id = request.form['album_id']
    file = request.files['file']
    caption = request.form['caption']
    tags = json.loads(request.form['tags'].lower())

    # Check if album exists
    cursor.execute(
        f"SELECT album_id FROM Albums WHERE user_id={user_id} AND album_id={album_id};")
    album_id = cursor.fetchone()['album_id']

    if not album_id:
        return jsonify({"success": False, "message": "Album does not exist."})
    
    # Check if path exists
    path = f"./public/imgs/{album_id}"
    if not os.path.exists(path):
        os.makedirs(path)
    
    # Save image to path
    save_path = f"{path}/{int(time.time())}-{file.filename}"
    file.save(save_path)

    # Save image to database
    cursor.execute(
        f"INSERT INTO Photos (album_id, caption, data) VALUES ('{album_id}', '{caption}', '{save_path}');")
    conn.commit()
    
    # get photo id
    cursor.execute(
        f'SELECT photo_id FROM Photos WHERE album_id={album_id} AND data="{save_path}" AND caption="{caption}";')
    photo_id = cursor.fetchone()['photo_id']

    # save tags
    for tag_name in tags:
        # add tag if it doesn't exist
        exists = cursor.execute(f"SELECT * FROM Tags WHERE tag_name='{tag_name}';")
        if not exists:
            cursor.execute(f"INSERT INTO Tags (tag_name) VALUES ('{tag_name}');")
            conn.commit()

        # get tag id
        cursor.execute(f"SELECT tag_id FROM Tags WHERE tag_name='{tag_name}';")
        tag_id = cursor.fetchone()['tag_id']

        # add tag to photo
        cursor.execute(
            f"INSERT INTO Has_Tag (tag_id, photo_id) VALUES ({tag_id}, {photo_id});")
        conn.commit()

    conn.commit()

    return jsonify({"success": True, "message": "Image uploaded."})

# GET ALBUM/IMAGES FROM ALBUM
@app.route('/albums', methods=['GET'])
def get_album():
    cursor = conn.cursor()

    # Variables
    album_id = request.args.get('album_id')

    cursor.execute(
        f"SELECT a.album_name, u.user_id, u.first_name, u.last_name FROM Albums a JOIN Users u ON a.user_id=u.user_id WHERE a.album_id={album_id}")
    result = cursor.fetchone()

    # Data
    album = {
        "album_id": album_id,
        "album_name": result['album_name'],
        "user_id": result['user_id'],
        "first_name": result['first_name'],
        "last_name": result['last_name'],
        "images": get_album_img(album_id),
    }

    return jsonify(album)

def get_album_img(album_id):
    cursor = conn.cursor()

    cursor.execute(
        f"SELECT photo_id, caption, data FROM Photos WHERE album_id={album_id}")
    result = cursor.fetchall()

    imgs = []
    for img in result:
        obj = img

        # Get Comments
        cursor.execute(
            f"SELECT first_name, last_name, text FROM Comments c JOIN Users u ON c.user_id=u.user_id where c.photo_id={img['photo_id']} ORDER BY date DESC;")
        comments = cursor.fetchall()
        obj["comments"] = comments
        obj["num_comments"] = len(comments)

        # Get Tags
        cursor.execute(
            f"SELECT t.tag_id, t.tag_name FROM Has_Tag ht JOIN Photos p JOIN Tags t ON t.tag_id=ht.tag_id AND p.photo_id=ht.photo_id where p.photo_id={img['photo_id']};")
        tags = cursor.fetchall()
        obj["tags"] = tags

        imgs.append(obj)

    return imgs

# DELETE IMAGE
@app.route('/albums/photo/delete', methods=['POST'])
@jwt_required()
def delete_img():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get user id and photo id
    user_id = cursor.fetchone()['user_id']
    photo_id = request.json['photo_id']

    # check if photo exists and belongs to user
    cursor.execute(
        f"SELECT * FROM Photos p JOIN Albums a WHERE p.photo_id={photo_id} AND a.user_id={user_id};")
    result = cursor.fetchone()

    if not result:
        return jsonify({"success": False, "message": "Photo does not exist or the user does not own the image."})

    # Delete photo
    cursor.execute(f"DELETE FROM Photos WHERE photo_id={photo_id};")
    conn.commit()

    return jsonify({"success": True, "message": "Photo deleted."})

# DELETE ALBUM
@app.route('/albums/delete', methods=['POST'])
@jwt_required()
def delete_album():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # get user id and album id
    user_id = cursor.fetchone()['user_id']
    album_id = request.json["album_id"]
    
    # check if user owns album
    cursor.execute(f"SELECT * FROM Albums WHERE album_id={album_id} AND user_id={user_id};")
    album = cursor.fetchone()
    
    if not album:
        return jsonify({"success": False, "message": "User does not own the album."})

    cursor.execute(f"DELETE FROM Albums WHERE album_id={album_id};")
    conn.commit()
    
    # Check if path exists and delete it
    path = f"./public/imgs/{album_id}"
    if os.path.exists(path):
        shutil.rmtree(f"./public/imgs/{album_id}")

    return jsonify({"success": True, "message": "Album deleted."})

# VIEW USER ALBUMS
@app.route('/albums/user', methods=['GET'])
@jwt_required()
def get_user_album():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")
    
    # Get user id
    user_id = cursor.fetchone()['user_id']
    
    cursor.execute(f"SELECT album_id, album_name, user_id FROM Albums WHERE user_id={user_id}")
    result = cursor.fetchall()
    
    albums = [{
        "album_id": album['album_id'],
        "album_name": album['album_name'],
        "user_id": album['user_id'],
        "images": get_album_img(album['album_id'])
    } for album in result]
    
    return jsonify({"albums": albums})

# LIKE IMAGE
@app.route('/imgs/like', methods=['POST'])
@jwt_required()
def like_img():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")
    
    user_id = cursor.fetchone()['user_id']
    photo_id = request.json["photo_id"]

    liked_already = cursor.execute(f"SELECT * FROM Likes WHERE user_id={user_id} AND photo_id={photo_id}")
    
    if liked_already:
        return jsonify({"success": False, "message": "Already liked."})

    cursor.execute(f"INSERT INTO Likes (user_id, photo_id) VALUES ({user_id}, {photo_id})")
    conn.commit()

    return jsonify({"success": True, "message": "Liked."})

# COMMENT ON IMAGE
@app.route('/imgs/comment', methods=['POST'])
@jwt_required(optional=True)
def comment_img():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    user = cursor.fetchone()

    # if there is no logged in user, use the guest user account
    if not user:
        user_id = 1
    else:
        user_id = user['user_id']

    # Get user id, photo id, comment text
    photo_id = request.json["photo_id"]
    text = request.json["text"]

    # user can't comment on their own photo
    cursor.execute(f"SELECT * FROM Photos p JOIN Albums a ON p.album_id=a.album_id WHERE p.photo_id={photo_id} AND a.user_id={user_id}")
    result = cursor.fetchone()

    if result:
        return jsonify({"success": False, "message": "User can't comment on their own photo."})

    cursor.execute(f"INSERT INTO Comments (user_id, photo_id, text, date) VALUES ({user_id}, {photo_id}, '{text}', '{datetime.now()}')")
    conn.commit()
    
    return jsonify({"success": True, "message": "Comment added."})

# GET GENERAL FEED
@app.route('/albums/all', methods=['GET'])
def get_general_feed():
    cursor = conn.cursor()

    cursor.execute(f"SELECT a.album_id, a.album_name, u.user_id, u.first_name, u.last_name FROM Albums a JOIN Users u ON a.user_id=u.user_id ORDER BY created DESC;")
    result = cursor.fetchall()
    
    albums = [{
        "album_id": album['album_id'],
        "album_name": album['album_name'],
        "user_id": album['user_id'],
        "first_name": album['first_name'],
        "last_name": album['last_name'],
        "images": get_album_img(album['album_id'])
    } for album in result]
    
    return jsonify({"albums": albums})

# GET FRIENDS FEED
@app.route('/albums/friend-feed', methods=['GET'])
@jwt_required()
def get_friend_feed():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")
    
    # Get user id
    user_id = cursor.fetchone()['user_id']

    cursor.execute(
        f"SELECT a.album_id, a.album_name, a.user_id, u.first_name, u.last_name FROM Albums a JOIN Friends f ON a.user_id=f.friend2 JOIN Users u on a.user_id=u.user_id WHERE f.friend1={user_id} LIMIT 10"
    )
    result = cursor.fetchall()

    albums = [
        {
            "album_id": album[0],
            "album_name": album[1],
            "user_id": album[2],
            "user_name": f"{album[3]} {album[4]}",
            "images": get_album_img(album[0]),
        }
        for album in result
    ]

    return jsonify(albums)


# --------------- #
# - TAGS ROUTER - # 
# --------------- #

# GET ALL TAGS
@app.route('/tags/all', methods=['GET'])
def get_all_tags():
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM Tags;")
    tags = cursor.fetchall()

    return jsonify({"tags": tags})

# GET TAG NAME
@app.route('/tag/name', methods=['GET'])
def get_tag_name():
    tag_id = request.args.get("tag_id")
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM Tags WHERE tag_id={tag_id}")
    tag = cursor.fetchone()

    return jsonify({"tag": tag})

# GET PHOTOS BY TAG
@app.route('/tag/photos', methods=['GET'])
def get_photos_by_tag():
    tag_id = request.args.get("tag_id")

    cursor = conn.cursor()

    cursor.execute(f"SELECT p.data, p.photo_id, p.caption, p.album_id, u.first_name, u.last_name FROM Photos p JOIN Has_Tag ht JOIN Albums a JOIN Users u ON u.user_id=a.user_id AND p.album_id=a.album_id AND ht.photo_id=p.photo_id WHERE ht.tag_id={tag_id};")
    photos = cursor.fetchall()

    for photo in photos:
        # get tags
        cursor.execute(f"SELECT t.tag_id, t.tag_name FROM Tags t JOIN Has_Tag ht WHERE ht.photo_id={photo['photo_id']} AND ht.tag_id=t.tag_id;")
        tags = cursor.fetchall()
        photo['tags'] = tags

    return jsonify({"photos": photos})

# GET USER'S TAGS
@app.route('/tags/user', methods=['GET'])
@jwt_required()
def get_user_tags():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")
    
    # Get user id
    user_id = cursor.fetchone()['user_id']

    cursor.execute(f"SELECT DISTINCT t.tag_id, t.tag_name FROM Tags t JOIN Has_Tag ht JOIN Photos p JOIN Albums a JOIN Users u ON u.user_id=a.user_id AND p.album_id=a.album_id AND t.tag_id=ht.tag_id AND p.photo_id=ht.photo_id WHERE u.user_id={user_id} AND ht.tag_id=t.tag_id;")
    tags = cursor.fetchall()

    return jsonify({"tags": tags})

# GET USER'S TAG PHOTOS
@app.route('/tag/user/photos', methods=['GET'])
@jwt_required()
def get_user_tags_photos():
    tag_id = request.args.get("tag_id")

    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")
    
    # Get user id
    user_id = cursor.fetchone()['user_id']

    cursor.execute(f"SELECT p.data, p.photo_id, p.caption, p.album_id, u.first_name, u.last_name FROM Photos p JOIN Has_Tag ht JOIN Albums a JOIN Users u ON u.user_id=a.user_id AND p.album_id=a.album_id AND ht.photo_id=p.photo_id WHERE ht.tag_id={tag_id} AND u.user_id={user_id};")
    photos = cursor.fetchall()

    for photo in photos:
        # get tags
        cursor.execute(f"SELECT t.tag_id, t.tag_name FROM Tags t JOIN Has_Tag ht WHERE ht.photo_id={photo['photo_id']} AND ht.tag_id=t.tag_id;")
        tags = cursor.fetchall()
        photo['tags'] = tags

    return jsonify({"photos": photos})

# GET MOST POPULAR TAG(S)
@app.route('/tags/popular', methods=['GET'])
def get_popular_tags():
    cursor = conn.cursor()

    cursor.execute(f"SELECT t.tag_id, t.tag_name, COUNT(*) AS num_photos FROM Tags t JOIN Has_Tag ht ON t.tag_id=ht.tag_id GROUP BY t.tag_id HAVING num_photos = (SELECT MAX(num_photos) FROM (SELECT ht.tag_id, COUNT(ht.tag_id) as num_photos FROM photoshare.Has_Tag ht GROUP BY ht.tag_id) as tc);")
    tags = cursor.fetchall()

    return jsonify({"tags": tags})

# SEARCH PHOTOS BY TAG
@app.route('/tags/search', methods=['GET'])
def search_tags():
    tags = request.args.get("tags")

    tags = tags.lower().split() # transform tags from space seperated string to list

    # ensure that all tags are valid
    for tag in tags:
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM Tags WHERE tag_name = '{tag}'")
        # tag doesn't exist, so there are no photos that match the search
        if cursor.fetchone() is None:
            return jsonify({"photos": []})

    tag_query = ', '.join(f"'{tag}'" for tag in tags) # create query for each tag

    # get all photos that contain all specified tags
    cursor.execute(f"SELECT p.data, p.photo_id, p.caption, p.album_id, u.first_name, u.last_name FROM Photos p JOIN Has_Tag ht JOIN tags t JOIN Albums a JOIN Users u ON u.user_id=a.user_id AND p.album_id=a.album_id AND ht.photo_id=p.photo_id AND ht.tag_id=t.tag_id WHERE t.tag_name IN ({tag_query}) GROUP BY p.photo_id HAVING COUNT(tag_name)={len(tags)};")
    photos = cursor.fetchall()

    for photo in photos:
        # get tags
        cursor.execute(f"SELECT t.tag_id, t.tag_name FROM Tags t JOIN Has_Tag ht WHERE ht.photo_id={photo['photo_id']} AND ht.tag_id=t.tag_id;")
        tags = cursor.fetchall()
        photo['tags'] = tags

    return jsonify({"photos": photos})

# -------------------------- #
# - COMMENTS SEARCH ROUTER - #
# -------------------------- #

@app.route('/comments/search', methods=['GET'])
def search_comments():
    text = request.args.get("text")

    cursor = conn.cursor()

    cursor.execute(f"SELECT u.user_id, u.first_name, u.last_name, u.email, COUNT(c.text) as matches FROM Comments c JOIN Users u ON c.user_id=u.user_id WHERE BINARY c.text='{text}' GROUP BY u.user_id ORDER BY matches DESC;")
    comments = cursor.fetchall()

    return jsonify({"comments": comments})


# ------------------------ #
# - USER ACTIVITY ROUTER - #
# ------------------------ #

@app.route('/user/leaderboard', methods=['GET'])
def get_user_leaderboard():
    cursor = conn.cursor()

    # get number of photos + comments left by each user
    cursor.execute("""
    SELECT photo_comment_score.user_id_photos as user_id,photo_comment_score.first_name_photos as first_name, photo_comment_score.last_name_photos as last_name, photo_comment_score.email_photos as email, COALESCE(num_photos, 0) + COALESCE(num_comments,0) as contribution_score
    FROM (
        SELECT DISTINCT * FROM (
            SELECT u.user_id as user_id_photos, u.first_name as first_name_photos, u.last_name as last_name_photos, u.email as email_photos, COUNT(a.user_id) as num_photos
                FROM Albums a JOIN Photos b ON a.album_id=b.album_id RIGHT JOIN Users u ON a.user_id=u.user_id
                WHERE u.user_id <> 1
                GROUP BY u.user_id ORDER BY COUNT(a.user_id)) AS photo_score
        LEFT OUTER JOIN (
            SELECT u.user_id as user_id_comments, COUNT(c.user_id) as num_comments
            FROM Comments c RIGHT JOIN Users u ON c.user_id=u.user_id
            GROUP BY u.user_id ORDER BY COUNT(c.user_id)) AS comment_score ON photo_score.user_id_photos = comment_score.user_id_comments) 
        AS photo_comment_score
        GROUP BY photo_comment_score.user_id_photos
        ORDER BY contribution_score
        DESC LIMIT 10;
    """)

    users = cursor.fetchall()

    return jsonify({"users": users})


# -------------------------- #
# - RECOMMENDATIONS ROUTER - #
# -------------------------- #

# GET FRIEND RECOMMENDATIONS
@app.route('/recommendations/friends', methods=['GET'])
@jwt_required()
def get_friend_recommendations():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get user id
    user_id = cursor.fetchone()['user_id']

    cursor.execute(
        f"SELECT DISTINCT f2.friend_b, u.first_name, u.last_name, u.email FROM Friends f1 JOIN Friends f2 ON f1.friend_b = f2.friend_a JOIN Users u ON f2.friend_b=u.user_id WHERE NOT EXISTS (SELECT * FROM Friends f WHERE f.friend_a = f1.friend_a and f.friend_b = f2.friend_b) AND f1.friend_a <> f2.friend_b AND f1.friend_a = {user_id};"
    )

    friend_recs = [
        {"user_id": r['friend_b'], 
        "first_name": r['first_name'],
        "last_name": r['last_name'],
        "email": r['email'],
        } for r in cursor.fetchall()
    ]

    return jsonify(friend_recs)

# GET PHOTO RECOMMENDATIONS
@app.route('/recommendations/photos', methods=['GET'])
@jwt_required()
def get_photo_recommendations():
    # Get id from email
    email = get_jwt_identity()
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get user id
    user_id = cursor.fetchone()['user_id']
    
    # Get top 5 tags to recommend
    cursor.execute(f"""
    SELECT Tags.tag_id
    FROM Tags JOIN Has_Tag JOIN Photos JOIN Albums
    ON Tags.tag_id = Has_Tag.tag_id AND Has_Tag.photo_id = Photos.photo_id AND Photos.album_id = Albums.album_id
    WHERE Albums.user_id={user_id}
    GROUP BY tag_id
    ORDER BY COUNT(*) DESC
    LIMIT 5
    """)
    top_tags = [a["tag_id"] for a in cursor.fetchall()]

    # user has uploaded no photos, return empty list
    if len(top_tags) == 0:
        return jsonify({"photos": []})

    cursor.execute(f"""
    SELECT NewPhotos.data, NewPhotos.photo_id, NewPhotos.caption, NewPhotos.first_name, NewPhotos.last_name, NewPhotos.email
    FROM (
        SELECT p.data, p.photo_id, p.caption, u.first_name, u.last_name, u.email, u.user_id
        FROM Photos p JOIN Albums a
        ON p.album_id = a.album_id
        JOIN Users u
        ON a.user_id = u.user_id
        JOIN Has_Tag ht
        ON p.photo_id = ht.photo_id
        GROUP BY p.photo_id
        ORDER BY COUNT(*) ASC
    ) AS NewPhotos
    JOIN Has_Tag 
    ON NewPhotos.photo_id = Has_Tag.photo_id
    WHERE tag_id IN ({",".join(str(top_tag) for top_tag in top_tags)}) AND
    NewPhotos.user_id <> {user_id}
    GROUP BY NewPhotos.photo_id
    ORDER BY COUNT(NewPhotos.photo_id) DESC
    """)
    
    photos = cursor.fetchall()

    for photo in photos:
        # get tags
        cursor.execute(f"SELECT t.tag_id, t.tag_name FROM Tags t JOIN Has_Tag ht WHERE ht.photo_id={photo['photo_id']} AND ht.tag_id=t.tag_id;")
        tags = cursor.fetchall()
        photo['tags'] = tags

    return jsonify({"photos": photos})


# --------------- #
# - MAIN ROUTER - #
# --------------- #

# ROOT
@app.route("/", methods=['GET'])
def slash(): return "Server is running..."

# DEBUGGING
if __name__ == "__main__":
    app.run(port=5000, debug=True)
