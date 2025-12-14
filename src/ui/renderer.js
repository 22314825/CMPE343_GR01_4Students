// ========== DEPARTMENTS ==========
function initDepartments() {
  const insertForm = document.getElementById('departmentInsertForm');
  const updateForm = document.getElementById('departmentUpdateForm');
  const deleteForm = document.getElementById('departmentDeleteForm');
  const table = document.getElementById('departmentsTable').querySelector('tbody');

  // Load data
  function loadDepartments() {
    window.db.department.getAll();
  }

  window.db.department.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(dept => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${dept.department_no}</td>
          <td>${dept.department_name}</td>
          <td>
            <button class="btn update-btn" onclick="fillDepartmentUpdate(${dept.department_no}, '${dept.department_name}')">Edit</button>
            <button class="btn delete-btn" onclick="deleteDepartment(${dept.department_no})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.department.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Department created successfully!');
      insertForm.reset();
      loadDepartments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create department'));
    }
  });

  window.db.department.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Department updated successfully!');
      updateForm.reset();
      loadDepartments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update department'));
    }
  });

  window.db.department.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Department deleted successfully!');
      loadDepartments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete department'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(insertForm);
    const data = {
      Department_No: parseInt(formData.get('Department_No') || insertForm.elements[0].value),
      Department_Name: formData.get('Department_Name') || insertForm.elements[1].value
    };
    window.db.department.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      Department_Name: updateForm.elements[1].value
    };
    window.db.department.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure you want to delete this department?')) {
      window.db.department.delete(id);
      deleteForm.reset();
    }
  });

  window.fillDepartmentUpdate = (no, name) => {
    updateForm.elements[0].value = no;
    updateForm.elements[1].value = name;
  };

  window.deleteDepartment = (id) => {
    if (confirm('Are you sure you want to delete this department?')) {
      window.db.department.delete(id);
    }
  };

  loadDepartments();
}

// ========== INSTRUCTORS ==========
function initInstructors() {
  const insertForm = document.getElementById('instructorInsertForm');
  const updateForm = document.getElementById('instructorUpdateForm');
  const deleteForm = document.getElementById('instructorDeleteForm');
  const table = document.getElementById('instructorsTable').querySelector('tbody');

  function loadInstructors() {
    window.db.instructor.getAll();
  }

  window.db.instructor.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(instr => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${instr.instructor_id}</td>
          <td>${instr.i_name}</td>
          <td>${instr.i_surname}</td>
          <td>${instr.salary || 'N/A'}</td>
          <td>${instr.i_age || 'N/A'}</td>
          <td>${instr.i_mail || 'N/A'}</td>
          <td>${instr.department_no}</td>
          <td>
            <button class="btn update-btn" onclick="fillInstructorUpdate(${instr.instructor_id}, '${instr.i_name}', '${instr.i_surname}', ${instr.salary}, ${instr.i_age}, '${instr.i_mail}', ${instr.department_no})">Edit</button>
            <button class="btn delete-btn" onclick="deleteInstructor(${instr.instructor_id})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.instructor.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Instructor created successfully!');
      insertForm.reset();
      loadInstructors();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create instructor'));
    }
  });

  window.db.instructor.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Instructor updated successfully!');
      updateForm.reset();
      loadInstructors();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update instructor'));
    }
  });

  window.db.instructor.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Instructor deleted successfully!');
      loadInstructors();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete instructor'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      Instructor_ID: parseInt(insertForm.elements[0].value),
      I_Name: insertForm.elements[1].value,
      I_Surname: insertForm.elements[2].value,
      Salary: parseFloat(insertForm.elements[3].value),
      I_Age: parseInt(insertForm.elements[4].value),
      I_Mail: insertForm.elements[5].value,
      Department_No: parseInt(insertForm.elements[6].value)
    };
    window.db.instructor.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      I_Name: updateForm.elements[1].value,
      I_Surname: updateForm.elements[2].value,
      Salary: parseFloat(updateForm.elements[3].value),
      I_Age: parseInt(updateForm.elements[4].value),
      I_Mail: updateForm.elements[5].value,
      Department_No: parseInt(updateForm.elements[6].value)
    };
    window.db.instructor.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure?')) {
      window.db.instructor.delete(id);
      deleteForm.reset();
    }
  });

  window.fillInstructorUpdate = (id, name, surname, salary, age, mail, dept) => {
    updateForm.elements[0].value = id;
    updateForm.elements[1].value = name;
    updateForm.elements[2].value = surname;
    updateForm.elements[3].value = salary;
    updateForm.elements[4].value = age;
    updateForm.elements[5].value = mail;
    updateForm.elements[6].value = dept;
  };

  window.deleteInstructor = (id) => {
    if (confirm('Are you sure?')) {
      window.db.instructor.delete(id);
    }
  };

  loadInstructors();
}

// ========== STUDENTS ==========
function initStudents() {
  const insertForm = document.getElementById('studentInsertForm');
  const updateForm = document.getElementById('studentUpdateForm');
  const deleteForm = document.getElementById('studentDeleteForm');
  const table = document.getElementById('studentsTable').querySelector('tbody');

  function loadStudents() {
    window.db.student.getAll();
  }

  window.db.student.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(student => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${student.student_id}</td>
          <td>${student.s_name}</td>
          <td>${student.s_surname}</td>
          <td>${student.s_age || 'N/A'}</td>
          <td>${student.s_email || 'N/A'}</td>
          <td>${student.registration_year || 'N/A'}</td>
          <td>${student.grade || 'N/A'}</td>
          <td>${student.department_no || 'N/A'}</td>
          <td>${student.advisor_id || 'N/A'}</td>
          <td>
            <button class="btn update-btn" onclick="fillStudentUpdate(${student.student_id}, '${student.s_name}', '${student.s_surname}', ${student.s_age}, '${student.s_email}', ${student.registration_year}, '${student.grade}', ${student.department_no}, ${student.advisor_id})">Edit</button>
            <button class="btn delete-btn" onclick="deleteStudent(${student.student_id})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.student.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Student created successfully!');
      insertForm.reset();
      loadStudents();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create student'));
    }
  });

  window.db.student.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Student updated successfully!');
      updateForm.reset();
      loadStudents();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update student'));
    }
  });

  window.db.student.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Student deleted successfully!');
      loadStudents();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete student'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      Student_ID: parseInt(insertForm.elements[0].value),
      S_Name: insertForm.elements[1].value,
      S_Surname: insertForm.elements[2].value,
      S_Age: parseInt(insertForm.elements[3].value),
      S_Email: insertForm.elements[4].value,
      Registration_Year: parseInt(insertForm.elements[5].value),
      Grade: insertForm.elements[6].value,
      Department_No: parseInt(insertForm.elements[7].value),
      Advisor_ID: parseInt(insertForm.elements[8].value)
    };
    window.db.student.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      S_Name: updateForm.elements[1].value,
      S_Surname: updateForm.elements[2].value,
      S_Age: parseInt(updateForm.elements[3].value),
      S_Email: updateForm.elements[4].value,
      Registration_Year: parseInt(updateForm.elements[5].value),
      Grade: updateForm.elements[6].value,
      Department_No: parseInt(updateForm.elements[7].value),
      Advisor_ID: parseInt(updateForm.elements[8].value)
    };
    window.db.student.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure?')) {
      window.db.student.delete(id);
      deleteForm.reset();
    }
  });

  window.fillStudentUpdate = (id, name, surname, age, email, year, grade, dept, advisor) => {
    updateForm.elements[0].value = id;
    updateForm.elements[1].value = name;
    updateForm.elements[2].value = surname;
    updateForm.elements[3].value = age;
    updateForm.elements[4].value = email;
    updateForm.elements[5].value = year;
    updateForm.elements[6].value = grade;
    updateForm.elements[7].value = dept;
    updateForm.elements[8].value = advisor;
  };

  window.deleteStudent = (id) => {
    if (confirm('Are you sure?')) {
      window.db.student.delete(id);
    }
  };

  loadStudents();
}

// ========== COURSES ==========
function initCourses() {
  const insertForm = document.getElementById('courseInsertForm');
  const updateForm = document.getElementById('courseUpdateForm');
  const deleteForm = document.getElementById('courseDeleteForm');
  const table = document.getElementById('coursesTable').querySelector('tbody');

  function loadCourses() {
    window.db.course.getAll();
  }

  window.db.course.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(course => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${course.course_id}</td>
          <td>${course.course_name}</td>
          <td>${course.credit || 'N/A'}</td>
          <td>${course.semester || 'N/A'}</td>
          <td>${course.instructor_id || 'N/A'}</td>
          <td>${course.department_no || 'N/A'}</td>
          <td>
            <button class="btn update-btn" onclick="fillCourseUpdate(${course.course_id}, '${course.course_name}', ${course.credit}, '${course.semester}', ${course.instructor_id}, ${course.department_no})">Edit</button>
            <button class="btn delete-btn" onclick="deleteCourse(${course.course_id})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.course.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Course created successfully!');
      insertForm.reset();
      loadCourses();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create course'));
    }
  });

  window.db.course.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Course updated successfully!');
      updateForm.reset();
      loadCourses();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update course'));
    }
  });

  window.db.course.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Course deleted successfully!');
      loadCourses();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete course'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      Course_ID: parseInt(insertForm.elements[0].value),
      Course_Name: insertForm.elements[1].value,
      Credit: parseInt(insertForm.elements[2].value),
      Semester: insertForm.elements[3].value,
      Instructor_ID: parseInt(insertForm.elements[4].value),
      Department_No: parseInt(insertForm.elements[5].value)
    };
    window.db.course.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      Course_Name: updateForm.elements[1].value,
      Credit: parseInt(updateForm.elements[2].value),
      Semester: updateForm.elements[3].value,
      Instructor_ID: parseInt(updateForm.elements[4].value),
      Department_No: parseInt(updateForm.elements[5].value)
    };
    window.db.course.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure?')) {
      window.db.course.delete(id);
      deleteForm.reset();
    }
  });

  window.fillCourseUpdate = (id, name, credit, semester, instructor, dept) => {
    updateForm.elements[0].value = id;
    updateForm.elements[1].value = name;
    updateForm.elements[2].value = credit;
    updateForm.elements[3].value = semester;
    updateForm.elements[4].value = instructor;
    updateForm.elements[5].value = dept;
  };

  window.deleteCourse = (id) => {
    if (confirm('Are you sure?')) {
      window.db.course.delete(id);
    }
  };

  loadCourses();
}

// ========== ENROLLMENTS ==========
function initEnrollments() {
  const insertForm = document.getElementById('enrollmentInsertForm');
  const updateForm = document.getElementById('enrollmentUpdateForm');
  const deleteForm = document.getElementById('enrollmentDeleteForm');
  const table = document.getElementById('enrollmentsTable').querySelector('tbody');

  function loadEnrollments() {
    window.db.enrollment.getAll();
  }

  window.db.enrollment.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(enroll => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${enroll.enrollment_id}</td>
          <td>${enroll.student_id}</td>
          <td>${enroll.course_id}</td>
          <td>${enroll.grade || 'N/A'}</td>
          <td>${enroll.enrollment_date ? new Date(enroll.enrollment_date).toLocaleDateString() : 'N/A'}</td>
          <td>${enroll.semester || 'N/A'}</td>
          <td>
            <button class="btn update-btn" onclick="fillEnrollmentUpdate(${enroll.enrollment_id}, ${enroll.student_id}, ${enroll.course_id}, '${enroll.grade}', '${enroll.enrollment_date}', '${enroll.semester}')">Edit</button>
            <button class="btn delete-btn" onclick="deleteEnrollment(${enroll.enrollment_id})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.enrollment.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Enrollment created successfully!');
      insertForm.reset();
      loadEnrollments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create enrollment'));
    }
  });

  window.db.enrollment.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Enrollment updated successfully!');
      updateForm.reset();
      loadEnrollments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update enrollment'));
    }
  });

  window.db.enrollment.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Enrollment deleted successfully!');
      loadEnrollments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete enrollment'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      Enrollment_ID: parseInt(insertForm.elements[0].value),
      Student_ID: parseInt(insertForm.elements[1].value),
      Course_ID: parseInt(insertForm.elements[2].value),
      Grade: insertForm.elements[3].value,
      Enrollment_Date: insertForm.elements[4].value,
      Semester: insertForm.elements[5].value
    };
    window.db.enrollment.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      Student_ID: parseInt(updateForm.elements[1].value),
      Course_ID: parseInt(updateForm.elements[2].value),
      Grade: updateForm.elements[3].value,
      Enrollment_Date: updateForm.elements[4].value,
      Semester: updateForm.elements[5].value
    };
    window.db.enrollment.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure?')) {
      window.db.enrollment.delete(id);
      deleteForm.reset();
    }
  });

  window.fillEnrollmentUpdate = (id, student, course, grade, date, semester) => {
    updateForm.elements[0].value = id;
    updateForm.elements[1].value = student;
    updateForm.elements[2].value = course;
    updateForm.elements[3].value = grade;
    updateForm.elements[4].value = date ? date.split('T')[0] : '';
    updateForm.elements[5].value = semester;
  };

  window.deleteEnrollment = (id) => {
    if (confirm('Are you sure?')) {
      window.db.enrollment.delete(id);
    }
  };

  loadEnrollments();
}

// ========== PAYMENTS ==========
function initPayments() {
  const insertForm = document.getElementById('paymentInsertForm');
  const updateForm = document.getElementById('paymentUpdateForm');
  const deleteForm = document.getElementById('paymentDeleteForm');
  const table = document.getElementById('paymentsTable').querySelector('tbody');

  function loadPayments() {
    window.db.payment.getAll();
  }

  window.db.payment.onGetAll((result) => {
    if (result.statusCode === 200 && result.data.data) {
      table.innerHTML = '';
      result.data.data.forEach(payment => {
        const row = table.insertRow();
        row.innerHTML = `
          <td>${payment.payment_id}</td>
          <td>${payment.student_id}</td>
          <td>${payment.payment_status || 'N/A'}</td>
          <td>${payment.payment_method || 'N/A'}</td>
          <td>${payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}</td>
          <td>${payment.payment_amount || 'N/A'}</td>
          <td>
            <button class="btn update-btn" onclick="fillPaymentUpdate(${payment.payment_id}, ${payment.student_id}, '${payment.payment_status}', '${payment.payment_method}', '${payment.payment_date}', ${payment.payment_amount})">Edit</button>
            <button class="btn delete-btn" onclick="deletePayment(${payment.payment_id})">Delete</button>
          </td>
        `;
      });
    }
  });

  window.db.payment.onCreate((result) => {
    if (result.statusCode === 201) {
      alert('Payment created successfully!');
      insertForm.reset();
      loadPayments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to create payment'));
    }
  });

  window.db.payment.onUpdate((result) => {
    if (result.statusCode === 200) {
      alert('Payment updated successfully!');
      updateForm.reset();
      loadPayments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to update payment'));
    }
  });

  window.db.payment.onDelete((result) => {
    if (result.statusCode === 200) {
      alert('Payment deleted successfully!');
      loadPayments();
    } else {
      alert('Error: ' + (result.data.message || 'Failed to delete payment'));
    }
  });

  insertForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      Student_ID: parseInt(insertForm.elements[1].value),
      Payment_Status: insertForm.elements[2].value,
      Payment_Method: insertForm.elements[3].value,
      Payment_Date: insertForm.elements[4].value,
      Payment_Amount: parseFloat(insertForm.elements[5].value)
    };
    window.db.payment.create(data);
  });

  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(updateForm.elements[0].value);
    const data = {
      Student_ID: parseInt(updateForm.elements[1].value),
      Payment_Status: updateForm.elements[2].value,
      Payment_Method: updateForm.elements[3].value,
      Payment_Date: updateForm.elements[4].value,
      Payment_Amount: parseFloat(updateForm.elements[5].value)
    };
    window.db.payment.update(id, data);
  });

  deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = parseInt(deleteForm.elements[0].value);
    if (confirm('Are you sure?')) {
      window.db.payment.delete(id);
      deleteForm.reset();
    }
  });

  window.fillPaymentUpdate = (id, student, status, method, date, amount) => {
    updateForm.elements[0].value = id;
    updateForm.elements[1].value = student;
    updateForm.elements[2].value = status;
    updateForm.elements[3].value = method;
    updateForm.elements[4].value = date ? date.split('T')[0] : '';
    updateForm.elements[5].value = amount;
  };

  window.deletePayment = (id) => {
    if (confirm('Are you sure?')) {
      window.db.payment.delete(id);
    }
  };

  loadPayments();
}

// ========== QUERIES ==========
function initQueries() {
  const runQueryBtn = document.getElementById('runQueryBtn');
  const querySelector = document.getElementById('querySelector');
  const resultsTable = document.getElementById('searchResultsTable');
  const headerRow = document.getElementById('searchHeaderRow');
  const resultsBody = document.getElementById('searchResultsBody');

  window.db.query.onRun((result) => {
    if (result.statusCode === 200 && result.data.data) {
      const data = result.data.data;
      
      if (data.length === 0) {
        headerRow.innerHTML = '<th>No Results</th>';
        resultsBody.innerHTML = '<tr><td>No data found</td></tr>';
        return;
      }

      // Generate headers
      const keys = Object.keys(data[0]);
      headerRow.innerHTML = keys.map(key => `<th>${key}</th>`).join('');

      // Generate rows
      resultsBody.innerHTML = '';
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = keys.map(key => `<td>${row[key] !== null ? row[key] : 'N/A'}</td>`).join('');
        resultsBody.appendChild(tr);
      });
    } else {
      alert('Error: ' + (result.data?.message || 'Failed to run query'));
    }
  });

  runQueryBtn.addEventListener('click', () => {
    const queryType = querySelector.value;
    if (!queryType) {
      alert('Please select a query first!');
      return;
    }
    window.db.query.run(queryType);
  });
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
  initDepartments();
  initInstructors();
  initStudents();
  initCourses();
  initEnrollments();
  initPayments();
  initQueries();
});
