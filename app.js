import express from 'express';
import cookieParser from 'cookie-parser';
import { PORT } from './config/env.js';
import subscriptionRouter from './routes/subcription.routes.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import connectDatabase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import arcjetMiddleware from './middleware/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

// Built-In middlewares:
// Allows app to send json data sent through APIs
app.use(express.json());
/*
When a user submits an HTML form, the browser packages that data into a specific format called application/x-www-form-urlencoded. 
This looks like a long string of key-value pairs (e.g., name=Amaan&email=amaan@example.com).
 */
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

// Created middlewares: 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send(`Welcome to the subscription tracker API`);
});
app.listen(PORT, async () => {
    console.log(`Server running at port http://localhost:${PORT}`);
    await connectDatabase();
});

export default app;

// 2:52:22