-- ===========================
-- DROP TABLES (Correct Order)
-- ===========================
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Instructor;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Department;

-- ===========================
--       DEPARTMENT
-- ===========================
CREATE TABLE Department (
    Department_No INT PRIMARY KEY,
    Department_Name VARCHAR(100) NOT NULL
);

-- ===========================
--       STUDENT
-- ===========================
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    S_Name VARCHAR(100) NOT NULL,
    S_Surname VARCHAR(100) NOT NULL,
    S_Age INT,
    S_Email VARCHAR(150),
    Registration_Year INT,
    Grade INT,
    Department_No INT,
    FOREIGN KEY (Department_No) REFERENCES Department(Department_No)
);

-- ===========================
--       INSTRUCTOR
-- ===========================
CREATE TABLE Instructor (
    Instructor_ID INT PRIMARY KEY,
    I_Name VARCHAR(100),
    I_Surname VARCHAR(100),
    Salary DECIMAL(10,2),
    I_Age INT,
    I_Mail VARCHAR(150)
);

-- ===========================
--       COURSE
-- ===========================
CREATE TABLE Course (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(150),
    Credit INT,
    Instructor_ID INT,
    Semester VARCHAR(20),
    Department_No INT,
    FOREIGN KEY (Instructor_ID) REFERENCES Instructor(Instructor_ID),
    FOREIGN KEY (Department_No) REFERENCES Department(Department_No)
);

-- ===========================
--       ENROLLMENT
-- ===========================
CREATE TABLE Enrollment (
    Enrollment_ID INT PRIMARY KEY,
    Student_ID INT,
    Course_ID INT,
    Grade INT,
    Enrollment_Date DATE,
    Semester VARCHAR(20),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- ===========================
--       PAYMENTS
-- ===========================
CREATE TABLE Payments (
    Payment_ID INT PRIMARY KEY,
    Payment_Status VARCHAR(50),
    Student_ID INT,
    Payment_Method VARCHAR(50),
    Payment_Date DATE,
    Payment_Amount DECIMAL(10,2),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);