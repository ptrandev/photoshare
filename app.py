# ----------- #
# - IMPORTS - #
# ----------- #

# Base Imports
import base64
import os

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

cors = CORS(app, supports_credentials = True, resources={r"/*": {"origins": "*"}})

app.secret_key = 'DeltaEchoEchoZuluNovemberUniformTangoSierra'  # A little throwback

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
    if cursor.execute(f"SELECT email  FROM Users WHERE email = '{email}'"):
        # this means there are greater than zero entries with that email
        return False
    else:
        return True


# ------------------ #
# - PROFILE ROUTER - #
# ------------------ #

# DISPLAY USER PROFILE
@app.route('/profile')
@flask_login.login_required
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
        print(cursor.execute(
            f"INSERT INTO Users (email, password, first_name, last_name, dob, hometown, gender) VALUES ('{email}', '{password}', '{first_name}', '{last_name}', '{dob}', '{hometown}', '{gender}')"))
        conn.commit()

        return {"success": True}
    else:
        print("couldn't find all tokens")
        return {"success": False}


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

    # Get ids of current user and friend
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

# GET IMAGE
@app.route('/albums/imgs', methods=['GET'])
def get_img():
    album_id = request.args.get('album_id')
    filename = request.args.get('filename')
    return send_file(f"./imgs/{album_id}/{filename}")

# UPLOAD IMAGE
@app.route('/albums/', methods=['POST'])
@flask_login.login_required
def upload_img():
    conn = mysql.connect()
    cursor = conn.cursor()

    # Variables
    user = flask_login.current_user
    album_name = request.form.get('album_name')
    form = request.form
    files = request.files

    # Save album to database
    cursor.execute(
        f"INSERT INTO Albums (user_id, album_name) VALUES ('{user.id}', '{album_name}');")
    conn.commit()
    cursor.execute(
        f"SELECT album_id FROM Albums WHERE user_id={user.id} AND album_name='{album_name}';")
    album_id = cursor.fetchone()[0]

    # Check if path exists
    path = f"./imgs/{album_id}"
    if not os.path.exists(path):
        os.makedirs(path)

    # Save images to database
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

    for img in files:
        # Add captions
        if not allowed_file(img):
            continue

        caption = form.get("cap_" + img)
        files.get(img).save(f"{path}/{img}")
        cursor.execute(
            f'INSERT INTO Photos (album_id, caption, photo_path) VALUES ({album_id}, "{caption}", "{img}");')
        conn.commit()

        # Add tags
        if form.get("tags_" + img) is None:
            continue

        tags = form.get("tags_" + img).split(",")

        for tag in tags:
            cursor.execute(f"SELECT tag_id FROM Tags WHERE tag='{tag}';")
            tag_id = cursor.fetchone()[0]

            cursor.execute(
                f'SELECT photo_id FROM Photos WHERE album_id={album_id} AND photo_path="{img}" AND caption={caption}";')
            photo_id = cursor.fetchone()[0]

            cursor.execute(
                f"INSERT INTO TagToPhotos (tag_id, photo_id) VALUES ({tag_id}, {photo_id});")
            conn.commit()

    return "Image Successfully Uploaded"

# GET ALBUM/IMAGES FROM ALBUM
@app.route('/albums/', methods=['GET'])
def get_album():
    conn = mysql.connect()
    cursor = conn.cursor()

    # Variables
    album_id = request.args.get('album_id')

    cursor.execute(
        f"SELECT a.album_name, u.user_id, u.first_name, u.last_name FROM Albums a JOIN Users u ON a.user_id=u.user_id WHERE a.album_id={album_id}")
    result = cursor.fetchone()

    # Data
    album = {
        "album_id": album_id,
        "album_name": result[0],
        "user_id": result[1],
        "user_name": f"{result[2]} {result[3]}",
        "images": get_album_img(album_id)
    }

    return jsonify(album)


def get_album_img(album_id):
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        f"SELECT photo_id, caption, photo_location FROM Photos WHERE album_id={album_id}")
    result = cursor.fetchall()

    imgs = []
    for img in result:
        obj = {"photo_id": img[0], "caption": img[1], "filename": img[2]}

        # Get Likes
        cursor.execute(
            f"SELECT first_name, last_name FROM Likes l JOIN Users u ON l.user_id=u.user_id where l.photo_id={img[0]};")
        likes = [f"{a[0]} {a[1]}" for a in cursor.fetchall()]
        obj["likes"] = likes
        obj["num_likes"] = len(likes)

        # Get Comments
        cursor.execute(
            f"SELECT first_name, last_name, text FROM Comments c JOIN Users u ON c.user_id=u.user_id where c.photo_id={img[0]};")
        comments = [{"user": f"{a[0]} {a[1]}", "text": a[2]}
                    for a in cursor.fetchall()]
        obj["comments"] = comments
        obj["num_comments"] = len(comments)

        imgs.append(obj)

    return imgs


# --------------- #
# - MAIN ROUTER - #
# --------------- #

@app.route('/whoami', methods=['GET'])
@flask_login.login_required
def whoami():
    return flask_login.current_user.id

# ROOT
@app.route("/", methods=['GET'])
def slash(): return "Server is running..."

# DEBUGGING
if __name__ == "__main__":
    app.run(port=5000, debug=True)
