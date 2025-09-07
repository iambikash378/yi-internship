import { isKeyObject } from "util/types";
import { db } from "../index.js";
import { queryObjects } from "v8";

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
    `

    if (queryObject.name){
        sql+=` AND a.name LIKE ?`;
        params.push(`%${queryObject.name}%`);
    }

    if (queryObject.sortAuthorsByBooks === "true"){
        const order = queryObject.order?.toUpperCase() === 'ASC' ? "ASC" : "DESC";
        sql += ` ORDER BY bba.bookCount ${order}`;
    }

    
    db.all(sql, params , (err, rows) =>{
        console.log(sql, params);
        if (err) return callback(err);
        callback(null, rows)
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

    db.all(sql, params, (err, rows) =>{
        if (err) return callback(err);
        callback(null, rows);
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
        SET title='${bookUpdatedDetails.title}', isbn = '${bookUpdatedDetails.isbn}' , author_id = '${bookUpdatedDetails.isbn}', published_year='${bookUpdatedDetails.published_year}'
        WHERE id = ${id}
        `
    , function(err){
        if(err) console.log("Error updating book details", err);
        console.log("Updated row with ID", id);
        callback(err);
    }
)
}