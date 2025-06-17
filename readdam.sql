book-- Generated SQL schema for the project
-- Date: 2025-06-03 (Asia/Seoul)

SET NAMES utf8mb4;
SET time_zone = '+09:00';
SET foreign_key_checks = 0;

-- ---------------------------------------------
-- USER TABLE
-- ---------------------------------------------
CREATE TABLE `user` (
    `username`  VARCHAR(255) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `email` VARCHAR(100) UNIQUE,
    `birth` DATE,
    `join_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `profile_img` VARCHAR(255),
    `fcm_token` VARCHAR(255),
    `deleted` TINYINT(1) DEFAULT 0,
    `withdrawal_reason` TEXT,
    `withdrawal_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_admin` TINYINT(1) DEFAULT 0,
    `lat` INT,
    `log` INT,
    `totoal_point` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- POINT TABLE
-- ---------------------------------------------
CREATE TABLE `point` (
    `point_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `point` INT DEFAULT 0,
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `reason` VARCHAR(255),
    CONSTRAINT `fk_point_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- ORDER TABLE
-- ---------------------------------------------
CREATE TABLE `order` (
    `order_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `payment_status` ENUM('PENDING','APPROVED','CANCELLED') DEFAULT 'PENDING',
    `payment_key` VARCHAR(255),
    `approved_at` DATETIME,
    `point_id` INT UNSIGNED,
    `payment_method` ENUM('CARD','BANK','POINT') DEFAULT 'CARD',
    `price` INT NOT NULL,
    CONSTRAINT `fk_order_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`),
    CONSTRAINT `fk_order_point`
        FOREIGN KEY (`point_id`) REFERENCES `point`(`point_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- ALERT TABLE
-- ---------------------------------------------
CREATE TABLE `alert` (
    `alert_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT,
    `is_checked` TINYINT(1) DEFAULT 0,
    `sender_name` VARCHAR(100),
    `username` VARCHAR(255) AS reciver,
    `type` VARCHAR(50),
    CONSTRAINT `fk_alert_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- WRITE TABLE
-- ---------------------------------------------
CREATE TABLE `write` (
    `write_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `tag1` VARCHAR(50),
    `tag2` VARCHAR(50),
    `tag3` VARCHAR(50),
    `tag4` VARCHAR(50),
    `tag5` VARCHAR(50),
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `end_date` DATETIME,
    `content` TEXT,
    `img` VARCHAR(255),
    `username` VARCHAR(255),
    `view_cnt` INT DEFAULT 0,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_write_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- Write LIKE TABLE 
-- ---------------------------------------------
CREATE TABLE `write_like` (
    `like_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `write_id` INT UNSIGNED,
    CONSTRAINT `fk_like_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_like_write`
        FOREIGN KEY (`write_id`) REFERENCES `write`(`write_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- WRITE COMMENT TABLE
-- ---------------------------------------------
CREATE TABLE `write_comment` (
    `write_comment_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT,
    `write_id` INT UNSIGNED,
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `username` VARCHAR(255),
    `adopted` TINYINT(1) DEFAULT 0,
    `is_secret` TINYINT(1) DEFAULT 0,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_wcomment_write`
        FOREIGN KEY (`write_id`) REFERENCES `write`(`write_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_wcomment_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- EVENT TABLE
-- ---------------------------------------------
CREATE TABLE `event` (
    `event_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255),
    `s_time` DATETIME,
    `e_time` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- WRITE SHORT TABLE
-- ---------------------------------------------
CREATE TABLE `write_short` (
    `writeshort_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT,
    `color` VARCHAR(20),
    `username` VARCHAR(255),
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `event_id` INT UNSIGNED,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_wshort_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`),
    CONSTRAINT `fk_wshort_event`
        FOREIGN KEY (`event_id`) REFERENCES `event`(`event_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- REPORT TABLE
-- ---------------------------------------------
CREATE TABLE `report` (
    `report_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reporter_id` INT UNSIGNED,
    `reported_id` INT UNSIGNED,
    `reason` VARCHAR(255),
    `category` VARCHAR(255),
    `category_id` VARCHAR(255),
    `reported_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('PENDING','RESOLVED','REJECTED') DEFAULT 'PENDING',
    CONSTRAINT `fk_report_reporter`
        FOREIGN KEY (`reporter_id`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_report_reported`
        FOREIGN KEY (`reported_id`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- PLACE TABLE
-- ---------------------------------------------
CREATE TABLE `place` (
    `place_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `location` VARCHAR(255),
    `phone` VARCHAR(20),
    `introduce` TEXT,
    `tag1` VARCHAR(50),
    `tag2` VARCHAR(50),
    `tag3` VARCHAR(50),
    `tag4` VARCHAR(50),
    `tag5` VARCHAR(50),
    `tag6` VARCHAR(50),
    `tag7` VARCHAR(50),
    `tag8` VARCHAR(50),
    `tag9` VARCHAR(50),
    `tag10` VARCHAR(50),
    `img1` VARCHAR(255),
    `img2` VARCHAR(255),
    `img3` VARCHAR(255),
    `img4` VARCHAR(255),
    `img5` VARCHAR(255),
    `img6` VARCHAR(255),
    `img7` VARCHAR(255),
    `img8` VARCHAR(255),
    `img9` VARCHAR(255),
    `img10` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- PLACE ROOM TABLE
-- ---------------------------------------------
CREATE TABLE `place_room` (
    `place_room_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `place_id` INT UNSIGNED,
    `point` INT DEFAULT 0,
    `min_person` INT,
    `max_person` INT,
    `name` VARCHAR(255),
    `introduce` TEXT,
    `size` VARCHAR(100),
    `has_air_conditioner` TINYINT(1) DEFAULT 0,
    `has_heater` TINYINT(1) DEFAULT 0,
    `has_wifi` TINYINT(1) DEFAULT 0,
    `has_power_outlet` TINYINT(1) DEFAULT 0,
    `has_whiteboard` TINYINT(1) DEFAULT 0,
    `has_window` TINYINT(1) DEFAULT 0,
    `has_tv` TINYINT(1) DEFAULT 0,
    `has_projector` TINYINT(1) DEFAULT 0,
    `img1` VARCHAR(255),
    `img2` VARCHAR(255),
    `img3` VARCHAR(255),
    `img4` VARCHAR(255),
    `img5` VARCHAR(255),
    `img6` VARCHAR(255),
    `img7` VARCHAR(255),
    `img8` VARCHAR(255),
    `img9` VARCHAR(255),
    `img10` VARCHAR(255),
    CONSTRAINT `fk_proom_place`
        FOREIGN KEY (`place_id`) REFERENCES `place`(`place_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- PLACE TIME TABLE
-- ---------------------------------------------
CREATE TABLE `place_time` (
    `place_time_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `place_room_id` INT UNSIGNED,
    `is_weekend` TINYINT(1) DEFAULT 0,
    `active` TINYINT(1) DEFAULT 1,
    `time` VARCHAR(50),
    CONSTRAINT `fk_ptime_proom`
        FOREIGN KEY (`place_room_id`) REFERENCES `place_room`(`place_room_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- PLACE REVIEW TABLE
-- ---------------------------------------------
CREATE TABLE `place_review` (
    `place_review_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT,
    `rating` INT DEFAULT 0,
    `username` VARCHAR(255),
    `reg_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `place_id` INT UNSIGNED,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_review_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`),
    CONSTRAINT `fk_preview_place`
        FOREIGN KEY (`place_id`) REFERENCES `place`(`place_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- CLASS TABLE
-- ---------------------------------------------
CREATE TABLE `class` (
    `class_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `leader_username` INT UNSIGNED,
    `title` VARCHAR(255),
    `short_intro` VARCHAR(255),
    `tag1` VARCHAR(50),
    `tag2` VARCHAR(50),
    `tag3` VARCHAR(50),
    `min_person` INT,
    `max_person` INT,
    `main_img` VARCHAR(255),
    `class_intro` TEXT,
    `leader_img` VARCHAR(255),
    `leader_intro` TEXT,
    `round1_date` DATETIME,
    `round1_place_name` VARCHAR(255),
    `round1_place_loc` VARCHAR(255),
    `round1_img` VARCHAR(255),
    `round1_content` TEXT,
    `round1_bookname` VARCHAR(255),
    `round1_bookimg` VARCHAR(255),
    `round1_bookwriter` VARCHAR(255),
    `round2_date` DATETIME,
    `round2_place_name` VARCHAR(255),
    `round2_place_loc` VARCHAR(255),
    `round2_img` VARCHAR(255),
    `round2_content` TEXT,
    `round2_bookname` VARCHAR(255),
    `round2_bookimg` VARCHAR(255),
    `round2_bookwriter` VARCHAR(255),
    `round3_date` DATETIME,
    `round3_place_name` VARCHAR(255),
    `round3_place_loc` VARCHAR(255),
    `round3_img` VARCHAR(255),
    `round3_content` TEXT,
    `round3_bookname` VARCHAR(255),
    `round3_bookimg` VARCHAR(255),
    `round3_bookwriter` VARCHAR(255),
    `round4_date` DATETIME,
    `round4_place_name` VARCHAR(255),
    `round4_place_loc` VARCHAR(255),
    `round4_img` VARCHAR(255),
    `round4_content` TEXT,
    `round4_bookname` VARCHAR(255),
    `round4_bookimg` VARCHAR(255),
    `round4_bookwriter` VARCHAR(255),
    CONSTRAINT `fk_class_leader`
        FOREIGN KEY (`leader_username`) REFERENCES `user`(`username`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- Class LIKE TABLE 
-- ---------------------------------------------
CREATE TABLE `class_like` (
    `like_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `class_id` INT UNSIGNED,
    CONSTRAINT `fk_like_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_like_class`
        FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- CLASS USER TABLE
-- ---------------------------------------------
CREATE TABLE `class_user` (
    `class_id` INT UNSIGNED,
    `username` VARCHAR(255),
    `join_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `left_date` DATETIME,
    PRIMARY KEY (`class_id`, `username`),
    CONSTRAINT `fk_cuser_class`
        FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_cuser_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- CLASS QNA TABLE
-- ---------------------------------------------
CREATE TABLE `class_qna` (
    `class_qna_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT UNSIGNED,
    `username` VARCHAR(255),
    `content` TEXT,
    `answer` TEXT,
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_secret` TINYINT(1) DEFAULT 0,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_cqna_class`
        FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_cqna_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- CLASS REVIEW TABLE
-- ---------------------------------------------
CREATE TABLE `class_review` (
    `class_review_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `class_id` INT UNSIGNED,
    `username` VARCHAR(255),
    `content` TEXT,
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `is_hide` TINYINT(1) DEFAULT 0,
    `rating` INT,
    `img` VARCHAR(255),
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_creview_class`
        FOREIGN KEY (`class_id`) REFERENCES `class`(`class_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_creview_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- LIBRARY TABLE
-- ---------------------------------------------
CREATE TABLE `library` (
    `library_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `name` VARCHAR(255),
    `is_show` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_library_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- BOOK TABLE
-- ---------------------------------------------
CREATE TABLE `book` (
    `book_isbn` VARCHAR(20) PRIMARY KEY,
    `ranking` INT,
    `title` VARCHAR(255),
    `publisher` VARCHAR(255),
    `pub_date` DATETIME
    `category` VARCHAR(255),
    `writer` VARCHAR(255),
    `review_cnt` INT DEFAULT 0,
    `view_cnt` INT DEFAULT 0,
    `rating` DECIMAL(3,2) DEFAULT 0,
    `book_img` VARCHAR(255),
    `book_intro` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- Book LIKE TABLE 
-- ---------------------------------------------
CREATE TABLE `book_like` (
    `like_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `book_isbn` VARCHAR(20),
    CONSTRAINT `fk_like_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_like_book`
        FOREIGN KEY (`book_isbn`) REFERENCES `book`(`book_isbn`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- LIBRARY BOOK TABLE
-- ---------------------------------------------
CREATE TABLE `library_book` (
    `librarybook_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `book_name` VARCHAR(255),
    `book_writer` VARCHAR(255),
    `book_img` VARCHAR(255),
    `library_id` INT UNSIGNED
    CONSTRAINT `fk_lbook_library`
        FOREIGN KEY (`library_id`) REFERENCES `library`(`library_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ---------------------------------------------
-- BOOK REVIEW TABLE
-- ---------------------------------------------
CREATE TABLE `book_review` (
    `book_review_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `book_isbn` VARCHAR(20),
    `rating` DECIMAL(3,2),
    `comment` TEXT,
    `reg_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `username` VARCHAR(255),
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_breview_book`
        FOREIGN KEY (`book_isbn`) REFERENCES `book`(`book_isbn`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_breview_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- OTHER PLACE TABLE
-- ---------------------------------------------
CREATE TABLE `other_place` (
    `other_place_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `address` VARCHAR(255),
    `phone` VARCHAR(20),
    `domain` VARCHAR(255),
    `weekday_stime` TIME,
    `weekday_etime` TIME,
    `weekend_stime` TIME,
    `weekend_etime` TIME,
    `introduce` TEXT,
    `img` VARCHAR(255),
    `fee` INT,
    `facilities` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- Place LIKE TABLE 
-- ---------------------------------------------
CREATE TABLE `place_like` (
    `like_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `place_id` INT UNSIGNED,
    CONSTRAINT `fk_like_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_like_place`
        FOREIGN KEY (`place_id`) REFERENCES `place`(`place_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- OTHER PLACE REVIEW TABLE
-- ---------------------------------------------
CREATE TABLE `other_place_review` (
    `other_place_review_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT,
    `rating` INT,
    `username` VARCHAR(255),
    `reg_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `other_place_id` INT UNSIGNED,
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_review_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_opreview_oplace`
        FOREIGN KEY (`other_place_id`) REFERENCES `other_place`(`other_place_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- INQUIRY TABLE
-- ---------------------------------------------
CREATE TABLE `inquiry` (
    `inquiry_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255),
    `content` TEXT,
    `answer` TEXT,
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('UNANSWERED','ANSWERED') DEFAULT 'UNANSWERED',
    `username` VARCHAR(255),
    `reason` VARCHAR(255),
    `is_hide` TINYINT(1) DEFAULT 0,
    CONSTRAINT `fk_inquiry_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- ---------------------------------------------
-- NOTICE TABLE
-- ---------------------------------------------
CREATE TABLE `notice` (
    `notice_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255),
    `content` TEXT,
    `reg_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `top_fix` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- RESERVATION DATE TABLE
-- ---------------------------------------------
CREATE TABLE `reservation_date` (
    `reservation_date_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reservation_id` INT UNSIGNED
    `date` DATETIME
    CONSTRAINT `fk_reservation_date`
        FOREIGN KEY (`reservation_id`) REFERENCES `reservation`(`reservation_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- RESERVATION TIME TABLE
-- ---------------------------------------------
CREATE TABLE `reservation_time` (
    `reservation_time_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reservation_date_id` INT UNSIGNED
    `time` TIME,
    `place_time_id` INT UNSIGNED,
    CONSTRAINT `fk_reservation_time`
        FOREIGN KEY (`reservation_date_id`) REFERENCES `reservation_date`(`reservation_date_id`)
        ON DELETE CASCADE
    CONSTRAINT `fk_place_time`
        FOREIGN KEY (`place_time_id`) REFERENCES `place_time`(`place_time_id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ---------------------------------------------
-- RESERVATION TABLE
-- ---------------------------------------------
CREATE TABLE `reservation` (
    `reservation_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255),
    `place_room_id` INT UNSIGNED,
    `participant_count` INT,
    `reserver_name` VARCHAR(255),
    `reserver_phone` VARCHAR(20),
    `request_message` TEXT,
    `status` ENUM('PENDING','CONFIRMED','CANCELLED') DEFAULT 'PENDING',
    CONSTRAINT `fk_resv_proom`
        FOREIGN KEY (`place_room_id`) REFERENCES `place_room`(`place_room_id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_reservation_user`
        FOREIGN KEY (`username`) REFERENCES `user`(`username`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- BANNER TABLE
-- ---------------------------------------------
CREATE TABLE `banner` (
    `banner_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255),
    `style` VARCHAR(50),
    `img` VARCHAR(255),
    `is_show` TINYINT(1) DEFAULT 1,
    `seq` INT DEFAULT 0,
    `title_text` VARCHAR(255),
    `content` TEXT,
    `btn1_name` VARCHAR(100),
    `btn1_link` VARCHAR(255),
    `btn1_color` VARCHAR(20),
    `btn1_is_show` TINYINT(1) DEFAULT 1,
    `btn2_name` VARCHAR(100),
    `btn2_link` VARCHAR(255),
    `btn2_color` VARCHAR(20),
    `btn2_is_show` TINYINT(1) DEFAULT 0,
    `back_color` VARCHAR(20) DEFAULT '#FFFFFF',
    `text_color` VARCHAR(20) DEFAULT '#000000'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET foreign_key_checks = 1;


