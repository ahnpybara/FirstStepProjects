-- 유저 테이블
CREATE TABLE users (
	user_id number(6) UNIQUE NOT NULL,
    email VARCHAR2(40) PRIMARY KEY,
    name VARCHAR2(40) NOT NULL,
    nickname VARCHAR2(40) UNIQUE NOT NULL,
    password VARCHAR2(40) NOT NULL,
	profile_image VARCHAR2(255)
);

-- 피드 테이블
CREATE TABLE feeds (
	feed_id number(6) PRIMARY KEY,
    email VARCHAR2(40) NOT NULL,
    feed_image VARCHAR2(255) NOT NULL,
    feed_content VARCHAR2(255) NOT NULL,
    
    CONSTRAINT fk_feeds_users FOREIGN KEY (email)
	REFERENCES users(email)
);

-- 검색
select * from USERS;
select * from feeds;

-- 유저 테이블의 시퀀스
create sequence seq_user_num increment by 1 start with 1
nocycle nocache;

-- 피드 테이블의 시퀀스
create sequence seq_feed_num increme-nt by 1 start with 1
nocycle nocache;

DROP SEQUENCE seq_feed_num;
DROP SEQUENCE seq_user_num;

-- 테이블 삭제
drop table users;
drop table feeds;

-- 값 삭제
delete from users;
delete from feeds;

-- 이메일 기준 피드테이블과 유저테이블을 조인 연산
SELECT f.feed_id, f.email, f.feed_image, f.feed_content, u.name, u.nickname
FROM feeds f
JOIN users u ON f.email = u.email;












