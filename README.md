# 📚 Library Management API

A RESTful API for managing a library system, built using **Node.js**, **TypeScript**, and **SQLite**.  
This project was created as part of the **YIPL Internship 2025** task. This is done in Vanilla NodeJS without the use of any frameworks.

---

## 🚀 Project Overview

The Library Management API allows you to manage authors and books with full CRUD functionality.  
Features include:

- **Authors Management**
  - Create and list authors
  - Filter by name, sort by book count
  - Retrieve an author with their books

- **Books Management**
  - Create, list, and update books
  - Filter by title, author, and year
  - Sort by title, published year, or created date
  - Retrieve a book with its author details

- **Validations**
  - Author name (min 2 chars), email (valid format)
  - Book title (min 1 char), year (valid), ISBN (exactly 10 digits)

- **Database**
  - Uses SQLite with proper relations (`author_id` foreign key in books)
  - Includes migration and seeder files for easy setup

---

## ⚙️ Tech Stack

- **Node.js** (Runtime)  
- **TypeScript** (Typed JavaScript)  
- **SQLite3** (Database)  

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/iambikash378/yi-internship.git
cd yi-internship
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Schema
```bash
node dist/migrations/createSchema.js
```

### 4. Add Seed Data /Initial Data
```bash
node dist/seeder/seedData.js
```
### 5. Run 
```bash
node index.js
```
