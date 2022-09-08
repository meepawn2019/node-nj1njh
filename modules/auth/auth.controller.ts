const bcrypt = require('bcryptjs');
import { Request, Response } from 'express';
import { MEMORY_DB } from '../..';
import { SALT_ROUNDS, STATUS_CODE } from '../../constanst';
import { UserDto, userLoginSchema, userRegisterSchema } from './auth.dto';
import { UserEntry } from './auth.schema';
import { getUserByUsername } from './auth.service';


module.exports.register = (req: Request, res: Response) => {
  // Validate user object using joi
  // - username (required, min 3, max 24 characters)
  // - email (required, valid email address)
  // - type (required, select dropdown with either 'user' or 'admin')
  // - password (required, min 5, max 24 characters, upper and lower case, at least one special character)
  const { value: registerUser, error }: {value: UserDto, error: any} = userRegisterSchema.validate(req.body);
  if (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: error.message });
  }
  // Check if user already exists
  const user = getUserByUsername(registerUser.username);
  if (user) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'auth-001' });
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
}

module.exports.login = (req: Request, res: Response) => {
  // Return 200 if username and password match
  const { value: loginUser, error }: {value: UserDto, error: any} = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: error.message });
  }
  // Check if user already exists
  const user = getUserByUsername(loginUser.username);
  if (!user) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'auth-002' });
  }
  const passwordHash = bcrypt.hashSync(loginUser.password, user.salt);
  if (passwordHash !== user.passwordhash) {
    return res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'auth-003' });
  }
  return res.status(STATUS_CODE.OK).json({ message: 'User logged in' });
}