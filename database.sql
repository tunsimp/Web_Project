-- Drop the database if it exists and recreate it
DROP DATABASE IF EXISTS secacademy;
CREATE DATABASE secacademy;
USE secacademy;

-- 1. Users Table
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name CHAR(50) NOT NULL,
  user_password CHAR(100) NOT NULL,
  user_role ENUM('user', 'admin') NOT NULL,
  user_email CHAR(50) NOT NULL
);

-- 2. LabInfo Table (new table for lab details)
CREATE TABLE LabInfo (
  labinfo_id INT AUTO_INCREMENT PRIMARY KEY,
  lab_name VARCHAR(100) NOT NULL,
  lab_description TEXT,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
  category VARCHAR(50),
  flag varchar(200) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Labs Table (with reference to LabInfo)
CREATE TABLE Labs (
  lab_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  labinfo_id INT NOT NULL,
  container_id VARCHAR(255) NOT NULL,
  status ENUM('running', 'terminate') DEFAULT 'running',
  started_at TIMESTAMP NULL DEFAULT NULL,
  ended_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (labinfo_id) REFERENCES LabInfo(labinfo_id)
);
CREATE TABLE UserLabCompletions (
    completion_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    labinfo_id INT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (labinfo_id) REFERENCES LabInfo(labinfo_id),
    UNIQUE KEY unique_user_lab (user_id, labinfo_id)
);
-- 4. Lessons Table
CREATE TABLE Lessons (
  lesson_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

-- 5. LessonPages Table
CREATE TABLE LessonPages (
  lessonpage_id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  page_number INT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id)
);

-- 6. UserLessonProgress Table
CREATE TABLE UserLessonProgress (
  userlesson_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  status ENUM('complete', 'incomplete') NOT NULL DEFAULT 'incomplete',
  current_page INT DEFAULT 1,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (lesson_id) REFERENCES Lessons(lesson_id)
);

-- Insert some sample data for testing
SELECT * FROM labinfo;

INSERT INTO LabInfo
  (lab_name, lab_description, difficulty, category,flag, is_active)
VALUES
  (
    'xss', -- lab_name
    'Learn about Cross-Site Scripting vulnerabilities. This lab covers reflected, stored, and DOM-based XSS attacks.', -- lab_description
    'intermediate', -- difficulty
    'Web Security', -- category
    'TS{xss_flag}',
    TRUE -- is_active
  ),
  (
    'ssti', -- lab_name
    'Explore Server-Side Template Injection vulnerabilities. Practice identifying and exploiting SSTI in common template engines.', -- lab_description
    'advanced', -- difficulty
    'Web Security', -- category
	'TS{ssti_flag}',
    TRUE -- is_active
  ),
  (
    'sqli', -- lab_name
    'Understand the fundamentals of SQL Injection. This beginner lab covers basic union-based and error-based injection techniques.', -- lab_description
    'beginner', -- difficulty
    'Injection Attacks', -- category
	'TS{sqli_flag}',
    TRUE -- is_active
  );
-- Sample users
select * from UserLabCompletions;
