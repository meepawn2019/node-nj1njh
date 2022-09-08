const express = require('express');
const authController = require('./auth/auth.controller');
const app = express();
app.use(express.json());
const port = 3000;

import { Request, Response } from 'express';
import { UserEntry } from './auth/auth.schema';


// Database mock where the username is the primary key of a user.
export const MEMORY_DB: Record<string, UserEntry> = {
  user1: {email: "test1@gmail.com", type: "user", salt: "", passwordhash: ""}
};

// CODE HERE
//
// I want to be able to register a new unique user (username and password). After the user is created I
// should be able to login with my username and password. If a user register request is invalid a 400 error
// should be returned, if the user is already registered a conflict error should be returned.
// On login the users crendentials should be verified.
// Because we dont have a database in this environment we store the users in memory. Fill the helper functions
// to query the memory db.

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json();
});

// Request body -> UserDto
app.get('/register', authController.register);

// Request body -> { username: string, password: string }
app.post('/login', authController.login);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

export {}