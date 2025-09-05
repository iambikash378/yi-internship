import {createServer, IncomingMessage, ServerResponse} from 'http';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

sqlite3.verbose()

const db = new sqlite3.Database('./database/librarydb.sqlite', (err)=>{
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

    switch(req.url){
        case '/authors' :{
            if(req.method === 'GET'){

            }
            else if (req.method === 'POST'){

            }
        break;
        }

        case '/books' :{
            if(req.method === 'GET'){

            }
            else if(req.method === 'POST'){

            }
        }

        

    }

    res.end("Hello from server");
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
