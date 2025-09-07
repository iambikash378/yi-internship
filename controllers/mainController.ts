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

    // for (const [key, value] of Object.entries(queryObject)){

    //     if()

    //     switch(key){

    //         case('name'):{
    //             params.push(` AND name LIKE %${value}%`);
    //             break;
    //         }

    //         case('sort'):{
    //             if(value === 'true')
    //                 sql = `
    //                     WITH booksByAuthor AS (
    //                         SELECT author_id, COUNT(*) bookCount
    //                         FROM books
    //                         GROUP BY author_id) 
    //                     SELECT a.* , bba.bookCount
    //                     FROM authors a
    //                     LEFT JOIN booksByAuthor bba
    //                     WHERE ?
    //                     ON bba.author_id = a.id
    //                     ORDER BY bba.bookCount ?
    //                 `
    //             }
    //             break;
    //         }
    //     }

    // if (!queryObject.name){
    //     const params = [];
    //     params.push(" 1 = 1")
    // }
    // if (queryObject.sort ==='true')
    // {if (!queryObject.order){
    //     params.push(" DESC")
    // }
    // else if(queryObject.order == "ASC"){
    //     params.push("ASC")
    // }
    // else{
    //     params.push("DESC")
    // }}

    
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
    let sql = `SELECT * FROM books WHERE 1=1`;
    const params = [];

    for (const [key, value] of Object.entries(queryObject)){
        sql+=` AND ${key} = ?`;
        params.push(value)
    }

    db.all(sql, params, (err, rows) =>{
        if (err) return callback(err);
        callback(null, rows)
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