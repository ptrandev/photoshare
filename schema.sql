DROP DATABASE photoshare;
CREATE DATABASE photoshare;
USE photoshare;

CREATE TABLE Users (
  user_id int4 AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  dob DATETIME,
  hometown VARCHAR(255),
  gender VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  CONSTRAINT user_pk PRIMARY KEY (user_id)
);

CREATE TABLE Friends (
  friend_a int4,
  friend_b int4,
  CONSTRAINT friend_a FOREIGN KEY (friend_a) REFERENCES Users(user_id),
  CONSTRAINT friend_b FOREIGN KEY (friend_b) REFERENCES Users(user_id)
);

CREATE TABLE Albums (
  album_id int4 AUTO_INCREMENT,
  user_id int4,
  album_name VARCHAR(255) NOT NULL,
  created DATETIME,
  CONSTRAINT album_pk PRIMARY KEY (album_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Photos (
  photo_id int4 AUTO_INCREMENT,
  album_id int4,
  caption VARCHAR(255),
  data VARCHAR(255) NOT NULL,
  CONSTRAINT photo_pk PRIMARY KEY (photo_id),
  CONSTRAINT album_id FOREIGN KEY (album_id) REFERENCES Albums(album_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
  comment_id int4 AUTO_INCREMENT,
  user_id int4,
  photo_id int4,
  text VARCHAR(255) NOT NULL,
  date DATETIME,
  CONSTRAINT comment_pk PRIMARY KEY (comment_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (photo_id) REFERENCES Photos(photo_id) ON DELETE CASCADE
);

CREATE TABLE Tags (
  tag_id int4 AUTO_INCREMENT,
  tag_name VARCHAR(255) NOT NULL UNIQUE,
  CONSTRAINT tag_pk PRIMARY KEY (tag_id)
);

CREATE TABLE Has_Tag (
  tag_id int4,
  photo_id int4,
  FOREIGN KEY (tag_id) REFERENCES Tags(tag_id),
  FOREIGN KEY (photo_id) REFERENCES Photos(photo_id) ON DELETE CASCADE
);

CREATE TABLE Likes (
  user_id int4,
  photo_id int4,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (photo_id) REFERENCES Photos(photo_id) ON DELETE CASCADE
);

-- Guest Account (REQUIRED FOR SYSTEM)
INSERT INTO Users (email, password, first_name, last_name, dob) VALUES ('guest@user.edu', 'guest', 'Guest', 'User', '2000-01-01');

-- Test Accounts (OPTIONAL)
INSERT INTO Users (email, password, first_name, last_name, dob, hometown, gender) VALUES ('dcmag@bu.edu', 'dcmag', 'Dominic', 'Maglione', '2001-12-18', 'Waterford', 'Male');
INSERT INTO Users (email, password, first_name, last_name, dob, hometown, gender) VALUES ('ptrandev@bu.edu', 'ptrandev', 'Phillip', 'Tran', '2002-01-29', 'Lowell', 'Male');