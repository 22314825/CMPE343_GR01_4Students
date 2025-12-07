/* ==========================================
   UNIVERSITY DBMS
   ========================================== */

/* 1. DROP EXISTING TABLES
   (Dropping in reverse order to avoid foreign key errors) */
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Enrollment;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Instructor;
DROP TABLE IF EXISTS Department;

/* 2. CREATE TABLES */

-- Table: Department
CREATE TABLE Department (
    Department_No INT PRIMARY KEY,
    Department_Name VARCHAR(100) NOT NULL
);

-- Table: Instructor
CREATE TABLE Instructor (
    Instructor_ID INT PRIMARY KEY,
    I_Name VARCHAR(50) NOT NULL,
    I_Surname VARCHAR(50) NOT NULL,
    Salary DECIMAL(10, 2),
    I_Age INT,
    I_Mail VARCHAR(100),
    Department_No INT,
    FOREIGN KEY (Department_No) REFERENCES Department(Department_No)
);

-- Table: Student
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    S_Name VARCHAR(50) NOT NULL,
    S_Surname VARCHAR(50) NOT NULL,
    S_Age INT,
    S_Email VARCHAR(100),
    Registration_Year INT,
    Grade VARCHAR(10),
    Department_No INT,
    Advisor_ID INT,
    FOREIGN KEY (Department_No) REFERENCES Department(Department_No),
    FOREIGN KEY (Advisor_ID) REFERENCES Instructor(Instructor_ID)
);

-- Table: Course
CREATE TABLE Course (
    Course_ID INT PRIMARY KEY,
    Course_Name VARCHAR(100) NOT NULL,
    Credit INT,
    Semester VARCHAR(20),
    Instructor_ID INT,
    Department_No INT,
    FOREIGN KEY (Instructor_ID) REFERENCES Instructor(Instructor_ID),
    FOREIGN KEY (Department_No) REFERENCES Department(Department_No)
);

-- Table: Enrollment
CREATE TABLE Enrollment (
    Enrollment_ID INT PRIMARY KEY,
    Student_ID INT,
    Course_ID INT,
    Grade VARCHAR(5),
    Enrollment_Date DATE,
    Semester VARCHAR(20),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Course_ID) REFERENCES Course(Course_ID)
);

-- Table: Payments
CREATE TABLE Payments (
    Payment_ID SERIAL PRIMARY KEY,
    Student_ID INT,
    Payment_Status VARCHAR(20),
    Payment_Method VARCHAR(50),
    Payment_Date DATE,
    Payment_Amount DECIMAL(10, 2),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);
