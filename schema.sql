CREATE DATABASE Photoshare;
USE Photoshare;

CREATE TABLE User (
  user_id int4 AUTO_INCREMENT,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  dob DATETIME,
  hometown VARCHAR(255),
  gender VARCHAR(255),
  password VARCHAR(255),
  CONSTRAINT user_pk PRIMARY KEY (user_id)
);

CREATE TABLE Are_Friend (
  friend_a int4,
  friend_b int4,
  CONSTRAINT friend_a FOREIGN KEY (friend_a) REFERENCES User(user_id),
  CONSTRAINT friend_b FOREIGN KEY (friend_b) REFERENCES User(user_id)
);

CREATE TABLE Album (
  album_id int4 AUTO_INCREMENT,
  user_id int4,
  album_name VARCHAR(255),
  created DATETIME,
  CONSTRAINT album_pk PRIMARY KEY (album_id),
  FOREIGN KEY (user_id) REFERENCES User (user_id)  
);

CREATE TABLE Photo (
  photo_id int4 AUTO_INCREMENT,
  album_id int4,
  caption VARCHAR(255),
  data VARCHAR(255),
  CONSTRAINT photo_pk PRIMARY KEY (photo_id),
  CONSTRAINT album_id FOREIGN KEY (album_id) REFERENCES Album(album_id)
);

CREATE TABLE Comment (
  comment_id int4 AUTO_INCREMENT,
  user_id int4,
  photo_id int4,
  text VARCHAR(255) NOT NULL,
  date DATETIME,
  CONSTRAINT comment_pk PRIMARY KEY (comment_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (photo_id) REFERENCES Photo(photo_id)
);

CREATE TABLE Tag (
  tag_id int4 AUTO_INCREMENT,
  tag_name VARCHAR(255),
  CONSTRAINT tag_pk PRIMARY KEY (tag_id)
);

CREATE TABLE Has_Tag (
  tag_id int4,
  photo_id int4,
  CONSTRAINT tag_id FOREIGN KEY (tag_id) REFERENCES Tag(tag_id),
  CONSTRAINT photo_id FOREIGN KEY (photo_id) REFERENCES Photo(photo_id)
);

INSERT INTO User (email, password) VALUES ('dcmag@bu.edu', 'dcmag');
INSERT INTO User (email, password) VALUES ('ptrandev@bu.edu', 'ptrandev');

DROP DATABASE Photoshare;