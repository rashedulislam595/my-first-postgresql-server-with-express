import type { NextFunction, Request, Response } from "express";
import fs from "fs"

const logger = (req:Request, res:Response, next:NextFunction) => {
    const log = `Method --> ${req.method} | URL --> ${req.url} | Time --> ${Date.now()}\n`
  
  //todo: file create kore write korbe
  fs.appendFile("logger.txt",log, (err)=>{
    if(err !== null){
        console.log(err)
    }
  });
  
  next();
}

export default logger;