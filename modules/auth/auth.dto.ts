const joi = require('joi');
import { EMAIL_PATTERN, PASSWORD_PATTERN } from "../../constanst";


export interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

export const userRegisterSchema = joi.object({
  username: joi.string().required().min(3).max(24),
  email: joi.string().required().pattern(EMAIL_PATTERN), 
  type: joi.string().valid('user', 'admin').required(),
  password: joi.string().pattern(PASSWORD_PATTERN).required(),
});

export const userLoginSchema = joi.object({
  username: joi.string().required().min(3).max(24),
  password: joi.string().pattern(PASSWORD_PATTERN).required(),
});