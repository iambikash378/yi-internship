import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/librarydb.sqlite');

const db = new sqlite3.Database(dbPath);

const authors = [
    ['J.K. Rowling', 'jk@random.com'],
    ['George R.R. Martin', 'grrm@got.com'],
    ['J.R.R. Tolkien', 'jrrt@rings.com'],
]

const books = [
    ['Harry Potter and the Sorcerer\'s Stone', '1234567890', 1, 1997],
    ['Game of Thrones', '0987654321', 2, 1996],
    ['The Hobbit', '1112131415', 3, 1937],
  ];


db.serialize(() =>{
})

