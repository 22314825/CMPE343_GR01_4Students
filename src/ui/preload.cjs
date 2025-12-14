const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('db', {
  // Departments
  department: {
    getAll: () => ipcRenderer.send('department:getAll'),
    create: (data) => ipcRenderer.send('department:create', data),
    update: (id, data) => ipcRenderer.send('department:update', { id, data }),
    delete: (id) => ipcRenderer.send('department:delete', id),
    onGetAll: (callback) => ipcRenderer.on('department:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('department:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('department:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('department:delete:response', (e, result) => callback(result))
  },

  // Instructors
  instructor: {
    getAll: () => ipcRenderer.send('instructor:getAll'),
    create: (data) => ipcRenderer.send('instructor:create', data),
    update: (id, data) => ipcRenderer.send('instructor:update', { id, data }),
    delete: (id) => ipcRenderer.send('instructor:delete', id),
    onGetAll: (callback) => ipcRenderer.on('instructor:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('instructor:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('instructor:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('instructor:delete:response', (e, result) => callback(result))
  },

  // Students
  student: {
    getAll: () => ipcRenderer.send('student:getAll'),
    create: (data) => ipcRenderer.send('student:create', data),
    update: (id, data) => ipcRenderer.send('student:update', { id, data }),
    delete: (id) => ipcRenderer.send('student:delete', id),
    onGetAll: (callback) => ipcRenderer.on('student:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('student:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('student:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('student:delete:response', (e, result) => callback(result))
  },

  // Courses
  course: {
    getAll: () => ipcRenderer.send('course:getAll'),
    create: (data) => ipcRenderer.send('course:create', data),
    update: (id, data) => ipcRenderer.send('course:update', { id, data }),
    delete: (id) => ipcRenderer.send('course:delete', id),
    onGetAll: (callback) => ipcRenderer.on('course:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('course:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('course:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('course:delete:response', (e, result) => callback(result))
  },

  // Enrollments
  enrollment: {
    getAll: () => ipcRenderer.send('enrollment:getAll'),
    create: (data) => ipcRenderer.send('enrollment:create', data),
    update: (id, data) => ipcRenderer.send('enrollment:update', { id, data }),
    delete: (id) => ipcRenderer.send('enrollment:delete', id),
    onGetAll: (callback) => ipcRenderer.on('enrollment:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('enrollment:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('enrollment:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('enrollment:delete:response', (e, result) => callback(result))
  },

  // Payments
  payment: {
    getAll: () => ipcRenderer.send('payment:getAll'),
    create: (data) => ipcRenderer.send('payment:create', data),
    update: (id, data) => ipcRenderer.send('payment:update', { id, data }),
    delete: (id) => ipcRenderer.send('payment:delete', id),
    onGetAll: (callback) => ipcRenderer.on('payment:getAll:response', (e, result) => callback(result)),
    onCreate: (callback) => ipcRenderer.on('payment:create:response', (e, result) => callback(result)),
    onUpdate: (callback) => ipcRenderer.on('payment:update:response', (e, result) => callback(result)),
    onDelete: (callback) => ipcRenderer.on('payment:delete:response', (e, result) => callback(result))
  },

  // Queries
  query: {
    run: (queryType) => ipcRenderer.send('query:run', queryType),
    onRun: (callback) => ipcRenderer.on('query:run:response', (e, result) => callback(result))
  }
});
