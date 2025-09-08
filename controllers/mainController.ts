import { isKeyObject } from "util/types";
import { db } from "../index.js";
import { queryObjects } from "v8";

interface Author{
    id: number;
    name:string;
    email:string;
    books?:{title: string}[];
}

interface Book{
    id: number;
    title: string;
    isbn: string;
    published_year: string;
    author_id: number;
    author_name?: string;
    author_email?:string;
    created_at: object;
}

export async function getAllAuthors(queryObject, callback){
    let sql = "SELECT * FROM authors WHERE 1=1 ?";
    const params = [];
    const whereClause = [];
    sql = `
        WITH booksByAuthor AS (
            SELECT author_id, COUNT(*) bookCount
            FROM books
            GROUP BY author_id)
        SELECT a.* , bba.bookCount
        FROM authors a
        LEFT JOIN booksByAuthor bba
        ON bba.author_id = a.id
        WHERE 1=1
    `

    if (queryObject.name){
        sql+=` AND a.name LIKE ?`;
        params.push(`%${queryObject.name}%`);
    }

    if (queryObject.sortAuthorsByBooks === "true"){
        const order = queryObject.order?.toUpperCase() === 'ASC' ? "ASC" : "DESC";
        sql += ` ORDER BY bba.bookCount ${order}`;
    }
    
    db.all(sql, params , (err, rows : Author[]) =>{
        console.log(sql, params);
        if (err) return callback(err);

        if (rows.length === 1){
            const author = rows[0];
            const bookParams = [author.id];

            const bookSql = `SELECT title FROM books
                    WHERE author_id = ?`

            db.all(bookSql, bookParams , (err, books: {title: string}[]) =>{
                if(err) return callback(err);
                author.books = books;
                callback(null, [author])
            })
        }
        else{
            callback(null, rows);
        }
    })
}

export function addNewAuthor(authorDetails, callback){
    db.run(
        `INSERT INTO authors (name, email) 
        VALUES ('${authorDetails.name}', '${authorDetails.email}')`, function (err){
            if(err) console.log("Error inserting new author", err);
            console.log("Inserted row with ID", this.lastID);
            callback(err , this.lastID);
        }
    )
}

export async function getAllBooks(queryObject, callback){
    let sql = `SELECT books.*, authors.name author_name FROM books
                LEFT JOIN authors
                ON books.author_id = authors.id
                WHERE 1=1`;

    const params = [];

    if (queryObject.title){
        sql+=` AND title LIKE ?`;
        params.push(`%${queryObject.title}%`);
    }

    if (queryObject.authorName){
        sql+=` AND authors.name = ? `;
        params.push(`${queryObject.authorName}`)
    }

    if (queryObject.publishedYear){
        sql+=` AND books.published_year = ?`;
        params.push(`${queryObject.publishedYear}`)
    }

    if (queryObject.sortBy){
        const order = queryObject.order?.toUpperCase() === "DESC" ? "DESC": "ASC";
        sql+=` ORDER BY ${queryObject.sortBy} ${order}`;
    }

    db.all(sql, params, (err, rows: Book[]) =>{
        if (err) return callback(err);

        if (rows.length === 1){
            const book = rows[0];
            const authorParams = [book.author_id];

            const bookSql = `SELECT name, email FROM authors
                    WHERE id = ?`

            db.all(bookSql, authorParams , (err, authorDetails: {name: string, email: string}[]) =>{
                if(err) return callback(err);
                book.author_name = authorDetails[0].name;
                book.author_email = authorDetails[0].email;
                callback(null, [book])
            })
        }
        else{
            callback(null, rows);
        }
    })
}


export function addNewBook(bookDetails, callback){
    db.run(
        `INSERT INTO books (title, isbn, published_year, author_id) 
        VALUES ('${bookDetails.title}', '${bookDetails.isbn}','${bookDetails.published_year}', '${bookDetails.author_id}')`, function (err){
            if(err) console.log("Error inserting new book", err);
            console.log("Inserted row with ID", this.lastID);
            callback(err , this.lastID);
        }
    )
}

export function updateBook(bookUpdatedDetails, id, callback){
    db.run(
        `UPDATE books 
        SET title='${bookUpdatedDetails.title}', isbn = '${bookUpdatedDetails.isbn}' , author_id = '${bookUpdatedDetails.author_id}', published_year='${bookUpdatedDetails.published_year}'
        WHERE id = ${id}
        `
    , function(err){
        if(err) console.log("Error updating book details", err);
        console.log("Updated row with ID", id);
        callback(err);
    }
)
}