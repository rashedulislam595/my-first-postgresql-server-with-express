import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path:path.resolve(process.cwd(),'.env')
})

const config = {
    port:process.env.PORT,
    connection_string: process.env.DATABASE_URL as string,
    secret_key: process.env.SECRET_KEY as string,
    secret_refresh_key:process.env.SECRET_REFRESH_KEY as string
}

export default config;