--primary key : unique + not null
CREATE TABLE users (
	user_id number(6) UNIQUE NOT NULL,
    email VARCHAR2(40) PRIMARY KEY,
    name VARCHAR2(40) NOT NULL,
    nickname VARCHAR2(40) UNIQUE NOT NULL,
    password VARCHAR2(40) NOT NULL,
	profile_image VARCHAR2(255)
);

--primary key : unique + not null
CREATE TABLE feeds (
	feed_id number(6) PRIMARY KEY,
    email VARCHAR2(40) UNIQUE NOT NULL,
    feed_image VARCHAR2(255) NOT NULL,
    feed_content VARCHAR2(255) NOT NULL,
    
    CONSTRAINT fk_feeds_users FOREIGN KEY (email)
	REFERENCES users(email)
);

select * from USERS;
select * from feeds;
SELECT user_num, email, name, nickname, password FROM users;
INSERT INTO users (user_num, email, name, nickname, password)
VALUES (seq_user_num.NEXTVAL, 'acy87@naver.com', '안치윤', 'ahnroe', 'your_password');
create sequence seq_user_num increment by 1 start with 1
nocycle nocache;

create sequence seq_feed_num increment by 1 start with 1
nocycle nocache;

DROP SEQUENCE seq_user_num;
drop table users;
drop table feeds;

select * from tab;



SELECT f.feed_id, f.email, f.feed_image, f.feed_content, u.name, u.nickname
FROM feeds f
JOIN users u ON f.email = u.email;















