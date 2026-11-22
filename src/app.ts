import express, { type Application, type Request, type Response } from 'express'
import { pool } from './db';
import { userRoute } from './modules/users/user.route';
import { profileRoute } from './modules/profiles/profile.route';
import { authRouter } from './modules/auth/auth.route';
import logger from './middleware/logger';
import globalErrorHandler from './middleware/globalErrorHandler';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { productsRoute } from './modules/products/products.route';
const app: Application = express()


// Adds headers: Access-Control-Allow-Origin: *
var corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))

app.use(cookieParser())
app.use(express.json())
app.use(express.text());
app.use(express.urlencoded({extended:true}))
app.use(logger)


app.use("/api/v1/users",userRoute);
app.use("/api/v1/profiles",profileRoute);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/products",productsRoute)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rashed"
  })
})

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;