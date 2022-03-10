export class AppError extends Error{
     public readonly statusCode;
    constructor(message:string, statusCode){
        super(<string>message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}