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
  content_path TEXT NOT NULL,
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
INSERT INTO Lessons (title, description) 
VALUES (
  'Cross-Site Scripting (XSS) Fundamentals', 
  'Learn how to identify, exploit, and prevent Cross-Site Scripting vulnerabilities. This lesson covers the three main types of XSS attacks: Reflected, Stored, and DOM-based XSS. You will understand how attackers can inject malicious scripts into web pages and how to implement proper input validation, output encoding, and Content Security Policy (CSP) to protect your applications.'
);

-- Insert lesson on SQL Injection (SQLi)
INSERT INTO Lessons (title, description) 
VALUES (
  'SQL Injection Attack and Defense', 
  'This comprehensive lesson explores SQL Injection vulnerabilities that occur when user-supplied data is incorrectly filtered before being included in SQL queries. Learn attack techniques including error-based, union-based, blind, and time-based SQL injection. The lesson also covers defensive strategies such as prepared statements, parameterized queries, ORM frameworks, and the principle of least privilege.'
);

-- Insert lesson on Server-Side Template Injection (SSTI)
INSERT INTO Lessons (title, description) 
VALUES (
  'Server-Side Template Injection Exploitation', 
  'Discover how Server-Side Template Injection vulnerabilities arise when user input is directly embedded into template engines like Jinja2, Twig, or FreeMarker. This lesson demonstrates how attackers can execute arbitrary code by injecting malicious template directives. You will learn detection techniques, exploit development, and prevention methods including proper template usage, input sanitization, and sandboxed template environments.'
);
INSERT INTO LessonPages (lesson_id, page_number, content_path) VALUES
-- Lesson 1: Cross-Site Scripting (XSS) Fundamentals (5 pages)
(1, 1, 'content/xss/introduction.html'),
(1, 2, 'content/xss/reflected.html'),
(1, 3, 'content/xss/stored.html'),
(1, 4, 'content/xss/dom-based.html'),
(1, 5, 'content/xss/prevention.html'),
-- Lesson 2: SQL Injection Attack and Defense (5 pages)
(2, 1, 'content/sqli/introduction.html'),
(2, 2, 'content/sqli/union-based.html'),
(2, 3, 'content/sqli/error-based.html'),
(2, 4, 'content/sqli/blind.html'),
(2, 5, 'content/sqli/prevention.html'),
-- Lesson 3: Server-Side Template Injection Exploitation (4 pages)
(3, 1, 'content/ssti/introduction.html'),
(3, 2, 'content/ssti/identification.html'),
(3, 3, 'content/ssti/exploitation.html'),
(3, 4, 'content/ssti/prevention.html');

select * from LessonPages;