import { eq } from "drizzle-orm";
import type { DbClient } from "./db/client";
import { usersTable } from "./db/schema";

export class AuthService {
  constructor(private readonly db: DbClient) {}

  async signup(input: {
    fullName: string;
  email: string;
  password: string;
}) {
  const existingUser = await this.db.query.usersTable.findFirst({
    where: (u, { eq }) => eq(u.email, input.email),
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const [user] = await this.db
    .insert(usersTable)
    .values({
      email: input.email,
      password: input.password,
      fullName: input.fullName,
    })
    .returning();

  return { user };
}

 async signin(input: { email: string; password: string }) {
  const user = await this.db.query.usersTable.findFirst({
    where: (u, { eq }) => eq(u.email, input.email),
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== input.password) {
    throw new Error("Invalid password");
  }

  return { user };
}
}