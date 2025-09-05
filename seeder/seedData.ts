import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/librarydb.sqlite');

const db = new sqlite3.Database(dbPath);

const authors = [
    ['J.K. Rowling', 'jk@example.com'],
    ['George R.R. Martin', 'grrm@example.com'],
    ['J.R.R. Tolkien', 'jrrt@example.com'],
    ['Agatha Christie', 'agatha@example.com'],
    ['Stephen King', 'king@example.com'],
    ['Jane Austen', 'austen@example.com'],
    ['Mark Twain', 'twain@example.com'],
    ['Ernest Hemingway', 'hemingway@example.com'],
    ['Isaac Asimov', 'asimov@example.com'],
    ['Leo Tolstoy', 'tolstoy@example.com'],
]

const books = [
    ['Harry Potter and the Sorcerer\'s Stone', '1234567890', 1, 1997],
    ['A Game of Thrones', '0987654321', 2, 1996],
    ['The Hobbit', '1112131415', 3, 1937],
    ['Murder on the Orient Express', '2223334445', 4, 1934],
    ['The Shining', '5556667778', 5, 1977],
    ['Pride and Prejudice', '9998887776', 6, 1813],
    ['Adventures of Huckleberry Finn', '4445556667', 7, 1884],
    ['The Old Man and the Sea', '7778889990', 8, 1952],
    ['Foundation', '1122334455', 9, 1951],
    ['War and Peace', '6677889900', 10, 1869],
  ];


db.serialize(() =>{

    const insertAuthor = db.prepare(`INSERT INTO authors (name, email) VALUES (?, ?)`);

    authors.forEach((author) => {
        insertAuthor.run(author, (err) =>{
            if (err) console.log('Error inserting author ', err)
        })
    })

    insertAuthor.finalize();

    const insertBook = db.prepare(
        `INSERT INTO books (title, isbn, author_id, published_year) VALUES (?, ?, ?, ?)`
      );
    
    books.forEach((book) => {
        insertBook.run(book, (err) =>{
            if (err) console.log('Error inserting book', err)
        })
    })

    insertBook.finalize();

    console.log("Done with seeding !");
    db.close();
})

