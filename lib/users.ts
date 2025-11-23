import bcrypt from "bcrypt";

export type User = {
  id: string;
  email: string;
  name?: string;
  password?: string; 
};

export const users: User[] = [
  {
    id: "1",
    email: "test@example.com",
    name: "Test User",
    password: bcrypt.hashSync("password123", 10),
  },
];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}