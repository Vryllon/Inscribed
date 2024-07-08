import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import sanitizeRequest from './middlewares/sanitzeRequest';

// Load the environment variables from the .env file
dotenv.config();

// Initialize express application
const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.post('/this-is-a-test-route-remove-before-deployment', sanitizeRequest, (req, res) => {res.status(200).send('Success')});

// Connect to the database and start the server
const MONGO_URI: string = process.env.MONGO_URI ?? '';
const PORT: number = parseInt(process.env.PORT ?? '5000', 10);

mongoose.connect(MONGO_URI)
.then(() => {

    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

})
.catch((error) => {

    console.error(`ERROR: Something went wrong while connecting to MongoDB : [${error}]`);

});