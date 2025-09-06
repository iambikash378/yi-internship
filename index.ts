import {createServer, IncomingMessage, ServerResponse} from 'http';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { addNewAuthor, getAllAuthors, getAllBooks, addNewBook, updateBook } from './controllers/mainController.js';

sqlite3.verbose()

export const db = new sqlite3.Database('./database/librarydb.sqlite', (err)=>{
    if(err){
        console.log("Error opening database", err)
    }
    else{
        console.log("Database opened successfully")
    }
});

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = createServer()
 ;

server.on("request", (req: IncomingMessage, res: ServerResponse) =>{
    console.log("New request received")

    switch(true){
        case req.url === '/authors' :{
            if(req.method === 'GET'){
                    getAllAuthors((err,rows) =>{
                        if (err) {
                            return res.end("Database Error")
                        }
                        res.end(JSON.stringify(rows))
                    })
            }
            else if (req.method === 'POST'){
                let body = ''
                req.on('data', chunk =>{
                    body += chunk.toString();
                })

                req.on('end', () =>{
                    try{
                        const authorDetails = JSON.parse(body);
                        addNewAuthor(authorDetails, (err, id) =>{
                            if (err) return res.end("Error inserting into database", err)
                            res.writeHead(201, {'Content-Type': 'application/json'})
                            res.end(JSON.stringify({
                                message:"author inserted",
                                author_id: id,
                                author_name: authorDetails.name,
                                author_email: authorDetails.email
                            }))
                        });
                    }
                    catch (err){
                        res.end("Couldn't add new author");
                    }
                })
            }
        break;
        }

        case req.url.startsWith('/books'):{
            if (req.url === '/books' || req.url === '/books/'){
                if(req.method === 'GET'){
                    getAllBooks((err,rows) =>{
                        if (err) {
                            return res.end("Error retrieving books from database")
                        }
                        res.end(JSON.stringify(rows))
                    })
                }
                else if(req.method === 'POST'){
                    let body = '';
                    req.on('data', (chunk)=>{
                        body+=chunk.toString();
                    })
    
                    req.on('end', () =>{
                        try{
                            const bookDetails = JSON.parse(body)
                            addNewBook(bookDetails, (err, id) =>{
                                if (err) return res.end("Error inserting into database", err)
                                    res.writeHead(201, {'Content-Type': 'application/json'})
                                    res.end(JSON.stringify({
                                        message:"new book inserted",
                                        book_id: id,
                                        book_name: bookDetails.title,
                                        book_isbn: bookDetails.isbn,
                                        published_year: bookDetails.published_year,
                                        author_id: bookDetails.author_id,
                                    }))
                            })
                        } catch (err){
                            res.end("Couldn't add new book")
                        }
                    })
                }
            } else {
                if (req.method === 'PUT'){
                    const id = req.url.split('/')[2];
                    let body = '';
                    req.on('data', (chunk)=>{
                        body+=chunk.toString();
                    })
    
                    req.on('end', () =>{
                        try{
                            const bookUpdatedDetails = JSON.parse(body)
                            updateBook(bookUpdatedDetails, id, (err) =>{
                                if (err) return res.end("Error updating database", err)
                                    res.writeHead(201, {'Content-Type': 'application/json'})
                                    res.end(JSON.stringify({
                                        message:"book updated",
                                        book_id: id,
                                        book_name: bookUpdatedDetails.title,
                                        book_isbn: bookUpdatedDetails.isbn,
                                        published_year: bookUpdatedDetails.published_year,
                                        author_id: bookUpdatedDetails.author_id,
                                    }))
                            })
                        } catch (err){
                            res.end("Couldn't update book details")
                        }
                    })
                }
                
            }

            break;
        }

    }

    console.log(req.url)

})

server.on("connection", ()=>{
    console.log("New connection established !")
})

server.on("error", (error) =>{
    console.error("Server error:", error)
})


server.listen(PORT, () =>{
    console.log(`Server started .Listening on port ${PORT}`);
})
