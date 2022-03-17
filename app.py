### IMPORTS ###
# Base Imports #
import base64
import os

# Flask Imports #
import flask
from flask import Flask, Response, request, render_template, redirect, url_for, jsonify
from flaskext.mysql import MySQL
import flask_login
from flask_cors import CORS, cross_origin
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from datetime import datetime, timedelta, timezone

# Environtment Imports #
from dotenv import load_dotenv
from itsdangerous import json
load_dotenv()


### CONFIGURATION ###
# Define APP and SQL #
mysql = MySQL()
app = Flask(__name__)
CORS(app, supports_credentials=True, origin="http://127.0.0.1:3000")

app.secret_key = 'DeltaEchoEchoZuluNovemberUniformTangoSierra'  # A little throwback

# SQL Configuration #
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = os.getenv('password')
app.config['MYSQL_DATABASE_DB'] = 'photoshare'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

app.config["JWT_SECRET_KEY"] = "DeltaEchoEchoZuluNovemberUniformTangoSierra"
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

# Login Code #
login_manager = flask_login.LoginManager()
login_manager.init_app(app)
conn = mysql.connect()
cursor = conn.cursor()
cursor.execute("SELECT email from Users")
users = cursor.fetchall()

# Login Manager
class User(flask_login.UserMixin):
    pass

<<<<<<< Updated upstream
# Managers

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
## AUTHENTICATION ##

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

=======
@login_manager.unauthorized_handler
def unauthorized_handler():
    return render_template('unauth.html')


### LOGIN ROUTER ###
@app.route('/login', methods=['POST'])
def login():
    # The request method is POST (page is recieving data)
    email = flask.request.form['email']
    cursor = conn.cursor()

    # Check if email is already registered
>>>>>>> Stashed changes
    if cursor.execute(f"SELECT password FROM Users WHERE email = '{email}'"):
        data = cursor.fetchall()
        pwd = str(data[0][0])
        if password == pwd:
            access_token = create_access_token(identity=email)
            response = {"access_token": access_token}
            return response

<<<<<<< Updated upstream
    return {"msg": "Wrong email or password"}, 401

@app.route("/logout", methods=["POST"])
=======
@app.route('/logout', methods=['GET'])
>>>>>>> Stashed changes
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
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


### USER ROUTER ###
# Accessor Methods
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

# Check Email Uniqueness
def isEmailUnique(email):
    # use this to check if a email has already been registered
    cursor = conn.cursor()
    if cursor.execute(f"SELECT email  FROM Users WHERE email = '{email}'"):
        # this means there are greater than zero entries with that email
        return False
    else:
        return True


### PROFILE ROUTER ###
@app.route('/profile')
@flask_login.login_required
def protected():
    return render_template('hello.html', name=flask_login.current_user.id, message="Here's your profile")


### FRIEND ROUTER ###
# Add Friends
@app.route('/friends/edit', methods=['POST'])
@flask_login.login_required
def add_friend():
    # Get id from email
    email = flask_login.current_user.id
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user and friend
    user_id = cursor.fetchone()[0]
    friend_id = request.json['friend_id']

    # Add friend to current user
    cursor = conn.cursor()
    cursor.execute(
        f"INSERT INTO Friends (friend_a, friend_b) VALUES ('{user_id}', '{friend_id}')")
    cursor.execute(
        f"INSERT INTO Friends (friend_a, friend_b) VALUES ('{friend_id}', '{user_id}')")

    return "Friend Added"

# Remove Friends
def remove_friend():
    # Get id from email
    email = flask_login.current_user.id
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user and friend
    user_id = cursor.fetchone()[0]
    friend_id = request.json['friend_id']

    # Remove friend from current user
    cursor = conn.cursor()
    cursor.execute(
        f"DELETE FROM Friends WHERE friend_a = '{user_id}' AND friend_b = '{friend_id}'")
    cursor.execute(
        f"DELETE FROM Friends WHERE friend_a = '{friend_id}' AND friend_b = '{user_id}'")

    return "Friend Removed"

# Search Friends
@app.route('/friends/search', methods=['GET'])
def search_friends():
    # Get query
    query = [request.args.get('firstName'), request.args.get('lastName')]
    cursor = conn.cursor()

    # Check if query contains 'first' or 'first last'
    if len(query) == 2:
        cursor.execute(
            f"SELECT user_id FROM Users WHERE first_name LIKE '{query[0]}%' AND last_name LIKE '{query[1]}%'")
        query = [x[0] for x in cursor.fetchall()]
        return jsonify(query)
    else:
        cursor.execute(
            f"SELECT user_id FROM Users WHERE first_name LIKE '{query[0]}%'")
        query = [x[0] for x in cursor.fetchall()]
        return jsonify(query)

# List Friends
@app.route('/friends/list', methods=['GET'])
@flask_login.login_required
def list_friends():
    # Get id from email
    email = flask_login.current_user.id
    cursor = conn.cursor()
    cursor.execute(f"SELECT user_id FROM Users WHERE email = '{email}'")

    # Get ids of current user and friend
    user_id = cursor.fetchone()[0]

    # Get friends
    cursor = conn.cursor()
    cursor.execute(
        f"SELECT F.friend_b, U.first_name, U.last_name FROM Friends F JOIN Users U ON U.user_id = F.friend_b WHERE friend_a = '{user_id}'")
    friends = [{
        "friend_id": x[0],
        "friend_name": x[1] + " " + x[2]
    } for x in cursor.fetchall()]

    return jsonify(friends)


### ALBUM ROUTER ###
@app.route('/albums/images', methods=['GET'])
def get_album_image():
    pass

# Create an album
@app.route('/albums/create', methods=['POST'])
@flask_login.login_required
def create_album():
    pass


# begin photo uploading code
# photos uploaded using base64 encoding so they can be directly embeded in HTML
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['GET', 'POST'])
@flask_login.login_required
def upload_file():
    if request.method == 'POST':
        uid = getUserIdFromEmail(flask_login.current_user.id)
        imgfile = request.files['photo']
        caption = request.form.get('caption')
        photo_data = imgfile.read()
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO Pictures (imgdata, user_id, caption) VALUES (%s, %s, %s )''', (photo_data, uid, caption))
        conn.commit()
        return render_template('hello.html', name=flask_login.current_user.id, message='Photo uploaded!', photos=getUsersPhotos(uid), base64=base64)
    # The method is GET so we return a  HTML form to upload the a photo.
    else:
        return render_template('upload.html')


### ROOT ###
@app.route("/", methods=['GET'])
def hello():
    return render_template('hello.html', message='Welecome to Photoshare')


### DEBUGGING ###
if __name__ == "__main__":
    app.run(port=5000, debug=True)
