import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { SubmitEventHandler } from "react";
import { signinUser, signupUser } from "#/serverFunctions/authFns";
import { setStoredAuthUser } from "#/auth/fakeAuth";
import type { SigninInput, SignupInput } from "#/types";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();

  const signupServerFn = useServerFn(signupUser);
  const signinServerFn = useServerFn(signinUser);

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: async (variables: { data: SignupInput | SigninInput }) => {
      if (mode === "signup") {
        return signupServerFn({
          data: variables.data as SignupInput,
        });
      }

      return signinServerFn({
        data: variables.data as SigninInput,
      });
    },
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    reset();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    try {
      const result =
        mode === "signup"
          ? await mutateAsync({
              data: {
                fullName: String(formData.get("fullName") ?? "").trim(),
                email,
                password,
              },
            })
          : await mutateAsync({
              data: {
                email,
                password,
              },
            });

      setStoredAuthUser(result.user);
      await navigate({ to: "/" });
    } catch {
      // error is shown below
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl border border-(--line) bg-[#fffdf8] p-6 shadow-[0_14px_30px_rgba(126,88,42,0.12)] sm:p-7">
      <h1 className="m-0 font-(--font-display) text-3xl leading-tight text-[#2f2518]">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>

      <p className="mt-2 text-sm text-(--ink-soft)">
        {mode === "signin"
          ? "Welcome back. Continue where you left off."
          : "Join DevJokes and save your favorite punchlines."}
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="grid gap-1.5">
            <label
              className="text-sm font-semibold text-[#4f3f2e]"
              htmlFor="fullName"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"
              placeholder="Ada Lovelace"
            />
          </div>
        ) : null}

        <div className="grid gap-1.5">
          <label
            className="text-sm font-semibold text-[#4f3f2e]"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"
            placeholder="you@company.com"
          />
        </div>

        <div className="grid gap-1.5">
          <label
            className="text-sm font-semibold text-[#4f3f2e]"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-[#e2d7c4] bg-[#fffdfa] px-3.5 py-2.5 text-(--ink-strong) placeholder:text-[#a89276] focus:border-[rgba(221,107,32,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(221,107,32,0.17)]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 inline-flex w-full items-center justify-center rounded-xl border-0 bg-[linear-gradient(180deg,#dd6b20_0%,#b45309_100%)] px-4 py-2.5 font-semibold text-[#fffaf2] shadow-[0_8px_16px_rgba(180,83,9,0.24)] transition-[transform,box-shadow] duration-150 ease-in-out hover:-translate-y-px hover:shadow-[0_10px_20px_rgba(180,83,9,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? mode === "signin"
              ? "Signing in..."
              : "Creating..."
            : mode === "signin"
              ? "Sign in"
              : "Create account"}
        </button>

        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error.message}
          </p>
        ) : null}
      </form>

      <p className="mt-4 text-sm text-[#7a6750]">
        {mode === "signin" ? "Need an account?" : "Already have an account?"}{" "}
        <Link
          to={mode === "signin" ? "/signup" : "/signin"}
          className="font-semibold text-[#b45309] no-underline hover:text-[#8f3f08]"
        >
          {mode === "signin" ? "Create one" : "Sign in"}
        </Link>
      </p>
    </section>
  );
}