const express = require('express');
const bcrypt = require('bcryptjs');
const joi = require('joi');
const app = express();
app.use(express.json());
const port = 3000;
const SALT_ROUNDS: number = 10;
const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
};
const PASSWORD_PATTERN: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,24}$/;

import { Request, Response } from 'express';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

interface UserEntry {
  email: string;
  type: 'user' | 'admin';
  salt: string;
  passwordhash: string;
}

// Database mock where the username is the primary key of a user.
const MEMORY_DB: Record<string, UserEntry> = {};

// CODE HERE
//
// I want to be able to register a new unique user (username and password). After the user is created I
// should be able to login with my username and password. If a user register request is invalid a 400 error
// should be returned, if the user is already registered a conflict error should be returned.
// On login the users crendentials should be verified.
// Because we dont have a database in this environment we store the users in memory. Fill the helper functions
// to query the memory db.

const userRegisterSchema = joi.object({
  username: joi.string().required().min(3).max(24),
  email: joi.string().email().required(),
  type: joi.string().valid('user', 'admin').required(),
  password: joi.string().pattern(PASSWORD_PATTERN).required(),
});

const userLoginSchema = joi.object({
  username: joi.string().required().min(3).max(24),
  password: joi.string().pattern(PASSWORD_PATTERN).required(),
});

function getUserByUsername(name: string): UserEntry | undefined {
  const user = MEMORY_DB[name];
  if (user) {
    return user;
  }
  return undefined;
}

function getUserByEmail(email: string): UserEntry | undefined {
  // find user by email in memory db
  const user = (Object.values(MEMORY_DB) as UserEntry[]).find(
    (user) => user.email === email
  );
  if (user) {
    return user;
  }
  return undefined;
}

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json();
});

// Request body -> UserDto
app.get('/register', (req: Request, res: Response) => {
  // Validate user object using joi
  // - username (required, min 3, max 24 characters)
  // - email (required, valid email address)
  // - type (required, select dropdown with either 'user' or 'admin')
  // - password (required, min 5, max 24 characters, upper and lower case, at least one special character)
  const { value: registerUser, error }: { value: UserDto; error: any } =
    userRegisterSchema.validate(req.body);
  if (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      error: 'auth-001',
      message: error.message,
    });
  }
  // Check if user already exists
  const user = getUserByUsername(registerUser.username);
  if (user) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      error: 'auth-0002',
      message: 'User already exists',
    });
  }
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = bcrypt.hashSync(registerUser.password, salt);
  const userEntry: UserEntry = {
    email: registerUser.email,
    type: registerUser.type,
    salt,
    passwordhash: passwordHash,
  };
  MEMORY_DB[registerUser.username] = userEntry;
  return res.status(STATUS_CODE.CREATED).json({ message: 'User created' });
});

// Request body -> { username: string, password: string }
app.post('/login', (req: Request, res: Response) => {
  // Return 200 if username and password match
  // Return 401 else
  const { value: loginUser, error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      error: 'auth-001',
      message: error.message,
    });
  }
  const user = getUserByUsername(loginUser.username);
  if (!user) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      error: 'auth-003',
      message: 'User does not exist',
    });
  }
  const passwordHash = bcrypt.hashSync(loginUser.password, user.salt);
  if (passwordHash !== user.passwordhash) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({
      error: 'auth-004',
      message: 'Wrong password',
    });
  }
  return res.status(STATUS_CODE.OK).json({ message: 'Login successful' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
