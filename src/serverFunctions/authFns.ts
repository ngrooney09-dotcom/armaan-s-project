import { createServerFn } from "@tanstack/react-start";
import type { SigninInput, SignupInput } from "#/types";

export const signupUser = createServerFn({ method: "POST" })
  .inputValidator((input: SignupInput) => input)
  .handler(async ({ data, context }) => {
    return context.authService.signup(data);
  });

export const signinUser = createServerFn({ method: "POST" })
  .inputValidator((input: SigninInput) => input)
  .handler(async ({ data, context }) => {
    return context.authService.signin(data);
  });