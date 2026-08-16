"use client";

import Link from "next/link";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  PlaneTakeoff,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Button,
} from "@/components/ui";

export default function LoginForm() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        !email.trim() ||
        !password.trim()
      ) {
        return;
      }

      setLoading(true);

      try {
        console.log({
          email,
          password,
        });

        /*
         * Later:
         *
         * const response =
         *   await login({
         *     email,
         *     password,
         *   });
         *
         * saveAuthData(...)
         */

        router.push(
          "/dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="relative flex min-h-dvh items-center px-4 py-10 sm:px-8 lg:px-12 xl:px-20">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#2e1065]/25 blur-[100px]" />

        <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[#fb7185]/[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        {/* Brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/10">
            <PlaneTakeoff
              size={20}
              className="text-[#fb7185]"
            />
          </div>

          <span className="voyage-gradient-text text-xl font-bold tracking-tight">
            VoyageAI
          </span>
        </Link>

        {/* Heading */}
        <div className="mt-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#e6e0e8] sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#948e9c]">
            Your AI travel concierge is ready to help plan your next journey.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={
            handleSubmit
          }
          className="mt-8 space-y-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#948e9c]"
            >
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f8798]"
              />

              <input
                id="email"
                type="email"
                value={email}
                onChange={(
                  event,
                ) =>
                  setEmail(
                    event.target
                      .value,
                  )
                }
                autoComplete="email"
                placeholder="traveler@example.com"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-4 text-sm text-[#e6e0e8] outline-none transition placeholder:text-[#596174] focus:border-[#fb7185]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#fb7185]/10"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#948e9c]"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#fb7185] transition hover:text-[#fcd34d]"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f8798]"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={
                  password
                }
                onChange={(
                  event,
                ) =>
                  setPassword(
                    event.target
                      .value,
                  )
                }
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-11 text-sm text-[#e6e0e8] outline-none transition placeholder:text-[#596174] focus:border-[#fb7185]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#fb7185]/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (
                      previous,
                    ) =>
                      !previous,
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#7f8798] transition hover:bg-white/[0.05] hover:text-[#cbc4d2]"
              >
                {showPassword ? (
                  <EyeOff
                    size={15}
                  />
                ) : (
                  <Eye
                    size={15}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Login */}
          <Button
            type="submit"
            fullWidth
            size="md"
            disabled={
              loading ||
              !email.trim() ||
              !password.trim()
            }
            className="h-11"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}

            {!loading && (
              <ArrowRight
                size={15}
              />
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />

          <span className="text-[11px] text-[#7f8798]">
            or continue with
          </span>

          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-[#cbc4d2] transition hover:bg-white/[0.06] hover:text-[#e6e0e8]"
        >
          <GoogleIcon />

          Continue with Google
        </button>

        {/* Signup */}
        <p className="mt-7 text-center text-xs text-[#948e9c]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
          >
            Start your journey
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z"
      />

      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.24-2.53c-.9.6-2.05.96-3.38.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.6A10 10 0 0 0 12 22Z"
      />

      <path
        fill="#FBBC05"
        d="M6.39 13.92A6 6 0 0 1 6.08 12c0-.67.11-1.32.31-1.92v-2.6H3.04A10 10 0 0 0 2 12c0 1.62.39 3.15 1.04 4.52l3.35-2.6Z"
      />

      <path
        fill="#EA4335"
        d="M12 5.95c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.48l3.35 2.6C7.18 7.7 9.39 5.95 12 5.95Z"
      />
    </svg>
  );
}