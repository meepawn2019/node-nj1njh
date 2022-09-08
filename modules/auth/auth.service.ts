import { MEMORY_DB } from "../..";
import { UserEntry } from "./auth.schema";

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

export { getUserByUsername, getUserByEmail };