/* ----------------------------------------------------------
   1. List the Top 5 Courses with the Highest Credits
   Function: fn_get_top5_highest_credit_courses
-----------------------------------------------------------*/
SELECT Course_Name, Credit
FROM Course
ORDER BY Credit DESC
LIMIT 5;


/* ----------------------------------------------------------
   2. Count How Many Courses Each Student Is Enrolled In
   Function: fn_get_course_count_per_student
-----------------------------------------------------------*/
SELECT s.S_Name, s.S_Surname, COUNT(e.Enrollment_ID) AS Total_Courses
FROM Student s
LEFT JOIN Enrollment e ON s.Student_ID = e.Student_ID
GROUP BY s.Student_ID;


/* ----------------------------------------------------------
   3. Display the Number of Students in Each Department
   Function: fn_get_student_count_per_department
-----------------------------------------------------------*/
SELECT d.Department_Name, COUNT(s.Student_ID) AS Student_Count
FROM Department d
LEFT JOIN Student s ON d.Department_No = s.Department_No
GROUP BY d.Department_No;


/* ----------------------------------------------------------
   4. Show the Total Payment Amount Made by Each Student
   Function: fn_get_total_payment_per_student
-----------------------------------------------------------*/
SELECT s.S_Name, s.S_Surname, SUM(p.Payment_Amount) AS Total_Paid
FROM Student s
JOIN Payments p ON s.Student_ID = p.Student_ID
GROUP BY s.Student_ID;


/* ----------------------------------------------------------
   5. List Courses with Credit Above the Average Credit Value
   Function: fn_get_courses_above_avg_credit
-----------------------------------------------------------*/
SELECT Course_Name, Credit
FROM Course
WHERE Credit > (SELECT AVG(Credit) FROM Course);


/* ----------------------------------------------------------
   6. Find the Most Enrolled Course
   Function: fn_get_most_enrolled_course
-----------------------------------------------------------*/
SELECT c.Course_Name, COUNT(e.Enrollment_ID) AS Total_Enrollments
FROM Course c
JOIN Enrollment e ON c.Course_ID = e.Course_ID
GROUP BY c.Course_ID
ORDER BY Total_Enrollments DESC
LIMIT 1;


/* ----------------------------------------------------------
   7. List Payments Made in the Last 30 Days
   Function: fn_get_recent_payments_30_days
-----------------------------------------------------------*/
SELECT p.Payment_ID, s.S_Name, s.S_Surname, p.Payment_Date, p.Payment_Amount
FROM Payments p
JOIN Student s ON p.Student_ID = s.Student_ID
WHERE p.Payment_Date >= CURRENT_DATE - INTERVAL '30 days';



/* ----------------------------------------------------------
   8. Calculate the Average Course Credit Per Department
   Function: fn_get_average_course_credit_per_department
-----------------------------------------------------------*/
SELECT d.Department_Name, AVG(c.Credit) AS Average_Credit
FROM Department d
JOIN Course c ON d.Department_No = c.Department_No
GROUP BY d.Department_No;


/* ----------------------------------------------------------
   9. Find Students Whose Surname Ends with “son”
   Function: fn_get_students_surname_ends_with_son
-----------------------------------------------------------*/
SELECT *
FROM Student
WHERE LOWER(S_Surname) LIKE '%son';


/* ----------------------------------------------------------
   10. Show Total Enrollment Count Per Course
   Function: fn_get_enrollment_count_per_course
-----------------------------------------------------------*/
SELECT c.Course_Name, COUNT(e.Student_ID) AS Student_Count
FROM Course c
LEFT JOIN Enrollment e ON c.Course_ID = e.Course_ID
GROUP BY c.Course_ID;



/* ----------------------------------------------------------
   11. List Students Who Are Not Enrolled in Any Course
   Function: fn_get_students_not_enrolled
-----------------------------------------------------------*/
SELECT S_Name, S_Surname
FROM Student
WHERE Student_ID NOT IN (SELECT Student_ID FROM Enrollment);


/* ----------------------------------------------------------
   12. Retrieve the Instructor with the Highest Salary
   Function: fn_get_highest_salary_instructor
-----------------------------------------------------------*/
SELECT I_Name, I_Surname, Salary
FROM Instructor
ORDER BY Salary DESC
LIMIT 1;



/* ----------------------------------------------------------
   13. Show Average Instructor Salary by Department
   Function: fn_get_avg_salary_per_department
-----------------------------------------------------------*/
SELECT d.Department_Name, AVG(i.Salary) AS Average_Salary
FROM Department d
JOIN Instructor i ON d.Department_No = i.Department_No
GROUP BY d.Department_No;



/* ----------------------------------------------------------
   14. Find Students Who Paid More Than 5000 Total
   Function: fn_get_students_paid_more_than_5000
-----------------------------------------------------------*/
SELECT s.S_Name, s.S_Surname, SUM(p.Payment_Amount) AS Total_Payment
FROM Student s
JOIN Payments p ON s.Student_ID = p.Student_ID
GROUP BY s.Student_ID
HAVING SUM(p.Payment_Amount) > 5000;



/* ----------------------------------------------------------
   15. Display Enrollment Date in a Formatted Style
   Function: fn_get_enrollment_formatted_dates
-----------------------------------------------------------*/
SELECT s.S_Name, s.S_Surname,
       TO_CHAR(e.Enrollment_Date, 'DD Mon YYYY') AS Formatted_Date
FROM Student s
JOIN Enrollment e ON s.Student_ID = e.Student_ID;