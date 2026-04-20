import { createMiddleware, createStart } from "@tanstack/react-start";
import { JokeService } from "#/dal/JokeService";
import { dbConnection } from "#/dal/db/client";
import { AuthService } from "#/dal/AuthService";

const servicesMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const db = dbConnection();

    const jokeService = new JokeService(db);
    const authService = new AuthService(db); 

    return next({
      context: {
        jokeService,
        authService, 
      },
    });
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [servicesMiddleware],
}));