import {describe, expect, test} from '@jest/globals';
import { MEMORY_DB } from '../..';
import { getUserByEmail, getUserByUsername } from "./auth.service";


// generate test cases
describe("auth", () => {

  it("should return user by username", () => {
    const user = getUserByUsername("user1");
    expect(user).toEqual(MEMORY_DB.user1);
  });

  it("should return undefined if user does not exist", () => {
    const user = getUserByUsername("user2");
    expect(user).toBeUndefined();
  });

  it("should return user by email", () => {
    const user = getUserByEmail("test1@gmail.com");
    expect(user).toEqual(MEMORY_DB.user1);
  });

  it("should return undefined if user does not exist", () => {
    const user = getUserByEmail("test2@gmail.com");
    expect(user).toBeUndefined();
  });
});