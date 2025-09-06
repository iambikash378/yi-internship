import { db } from "../index.js";

export async function getAllAuthors(callback){
    db.all("SELECT * FROM authors", (err, rows) =>{
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

export async function getAllBooks(callback){
    db.all("SELECT * FROM books", (err, rows) =>{
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