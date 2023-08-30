--primary key : unique + not null
CREATE TABLE users (
	user_id number(6) UNIQUE NOT NULL,
    email VARCHAR2(20) PRIMARY KEY,
    name VARCHAR2(10) NOT NULL,
    nickname VARCHAR2(20) UNIQUE NOT NULL,
    password VARCHAR2(20) NOT NULL,
	profile_image VARCHAR2(255)
);

--primary key : unique + not null
CREATE TABLE feeds (
	feed_id number(6) PRIMARY KEY,
    email VARCHAR2(20) UNIQUE NOT NULL,
    feed_image VARCHAR2(255) NOT NULL,
    
    CONSTRAINT fk_feeds_users FOREIGN KEY (email)
	REFERENCES users(email)
);

select * from USERS;
SELECT user_num, email, name, nickname, password FROM users;
INSERT INTO users (user_num, email, name, nickname, password)
VALUES (seq_user_num.NEXTVAL, 'acy87@naver.com', '안치윤', 'ahnroe', 'your_password');
create sequence seq_user_num increment by 1 start with 1
nocycle nocache;

create sequence seq_feed_num increment by 1 start with 1
nocycle nocache;

drop table users;

select * from tab;



















