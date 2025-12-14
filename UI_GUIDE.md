# University Management System - UI Guide

## ✅ Setup Complete!

Your UI is now connected to your database! Here's how to use it:

## 🚀 How to Run

```bash
npm start
```

or

```bash
npm run ui
```

## 📋 What's Connected

### Tables (Full CRUD Operations)
- ✅ **Departments** - Create, Read, Update, Delete
- ✅ **Instructors** - Create, Read, Update, Delete
- ✅ **Students** - Create, Read, Update, Delete
- ✅ **Courses** - Create, Read, Update, Delete
- ✅ **Enrollments** - Create, Read, Update, Delete
- ✅ **Payments** - Create, Read, Update, Delete

### Search/Queries
- ✅ **15 predefined queries** from your quariesController.js

## 🎯 Features

1. **Left Menu Navigation** - Click on any table name to view/edit that table
2. **Insert Forms** - Add new records to any table
3. **Update Forms** - Modify existing records (click "Edit" button on any row)
4. **Delete** - Remove records (click "Delete" button on any row)
5. **Search Queries** - Run complex SQL queries from the dropdown

## 🔧 How It Works

1. **main.js** - Electron main process that loads your controllers
2. **preload.js** - Secure bridge between UI and backend
3. **renderer.js** - Frontend logic that connects forms to database
4. **index.html** - Your UI (already created by designer)
5. **controllersBridge.mjs** - Bridges ES modules to CommonJS

## 📝 Notes

- All database operations use your existing controllers
- Changes are immediately reflected in the database
- The UI automatically refreshes after Create/Update/Delete operations
- DevTools will open automatically for debugging

## 🎨 UI Structure

```
Menu (Left Side)
├── Students
├── Instructors
├── Courses
├── Departments
├── Enrollments
├── Payments
└── Search (Queries)

Content Area (Right Side)
├── Insert Form
├── Update Form
├── Delete Form
└── Data Table
```

## 🐛 Troubleshooting

If you encounter issues:
1. Make sure your `.env` file has correct database credentials
2. Check the DevTools console for errors
3. Verify all dependencies are installed: `npm install`

Enjoy your University Management System! 🎓
