-- ==========================================
-- PHASE 1: DESIGN (DDL)
-- Database Schema for University System
-- ==========================================

-- ==========================
-- DROP TABLES (Correct Order)
-- ==========================
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Department;
DROP TABLE IF EXISTS Instructor;

-- ==========================
-- 1. Create INSTRUCTOR table
-- ==========================
CREATE TABLE Instructor (
    Instructor_ID INT PRIMARY KEY,
    I_Name VARCHAR(50) NOT NULL,
    I_Surname VARCHAR(50) NOT NULL,
    Salary DECIMAL(10, 2) CHECK (Salary > 0),
    Course_Name VARCHAR(100),
    I_Age INT,
    I_Mail VARCHAR(100) UNIQUE
);

-- ==========================
-- 2. Create DEPARTMENT table
-- ==========================
CREATE TABLE Department (
    Department_No INT PRIMARY KEY,
    Department_Name VARCHAR(100) UNIQUE NOT NULL,
    Instructor_ID INT,  -- Head of Department
    Course_ID INT,       -- Representative Course ID
    Payment DECIMAL(15, 2),
    FOREIGN KEY (Instructor_ID)
        REFERENCES Instructor(Instructor_ID)
        ON DELETE SET NULL
);

-- ==========================
-- 3. Create COURSE table
-- ==========================
CREATE TABLE Course (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(100) NOT NULL,
    Credit INT CHECK (Credit > 0 AND Credit <= 10),
    Instructor_ID INT,
    Semester VARCHAR(20),
    FOREIGN KEY (Instructor_ID)
        REFERENCES Instructor(Instructor_ID)
);

-- ==========================
-- 4. Create STUDENT table
-- ==========================
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    S_Name VARCHAR(50) NOT NULL,
    S_Surname VARCHAR(50) NOT NULL,
    S_Age INT CHECK (S_Age >= 17),
    Enrollment_Year INT DEFAULT 2023,
    Grade VARCHAR(5),
    S_Email VARCHAR(100) UNIQUE,
    Department_Name VARCHAR(100),
    FOREIGN KEY (Department_Name)
        REFERENCES Department(Department_Name)
        ON UPDATE CASCADE
);

-- ==========================
-- 5. Create ENROLLMENT table
-- ==========================
CREATE TABLE Enrollment (
    Enrollment_ID INT PRIMARY KEY,
    Student_ID INT,
    Course_ID INT,
    Grade VARCHAR(5),
    Enrollment_Date DATE DEFAULT CURRENT_DATE,
    Semester VARCHAR(20),
    FOREIGN KEY (Student_ID)
        REFERENCES Student(Student_ID)
        ON DELETE CASCADE,
    FOREIGN KEY (Course_ID)
        REFERENCES Course(Course_ID)
        ON DELETE CASCADE
);

-- ==========================
-- 6. Create PAYMENTS table
-- ==========================
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY,
    Payment_Status VARCHAR(20)
        CHECK (Payment_Status IN ('Paid', 'Pending', 'Overdue')),
    Student_ID INT,
    Payment_Method VARCHAR(50),
    Payment_Date DATE,
    Payment_Amount DECIMAL(10, 2),
    FOREIGN KEY (Student_ID)
        REFERENCES Student(Student_ID)
);
