export interface IUser {
    name:string,
    email:string,
    password:string,
    age:number,
    role?:string
}

export interface IUpdateUser{
    name:string,
    password:string,
    age:number,
    is_Active:boolean,
    role:string
    
}