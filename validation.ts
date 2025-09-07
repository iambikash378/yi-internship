export async function authorValidation(authorDetails, callback){
    const err = undefined;

    if(!authorDetails.name){
        const err = "Author's name is mandatory."
        return callback(err);
    }

    if(!authorDetails.email){
        const err = "Email is mandatory.";
        return callback(err);
    }
 
    if(authorDetails.name.length < 2){
        const err = "Name should be 2 letters or more";
        return callback(err);
    }

    const email_regex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const regexTest: boolean = email_regex.test(authorDetails.email);

    if(!regexTest){
        const err ="Invalid Email Format";
        return callback(err)
    }

    return callback(err)
}


export async function bookValidation(bookDetails, callback){
    const err = undefined;

    if(!bookDetails.name){
        const err = "Book name is mandatory."
        return callback(err);
    }

    if(bookDetails.name.length < 1){
        const err = "Book name should have at least 1 character"
        return callback(err);
    }

    const isbn_regex : RegExp = /^[0-9]{10,10}$/;
    if(!isbn_regex.test(bookDetails.isbn)){
        const err ="Invalid Regex Format";
        return callback(err);
    }

    return callback(err);

}