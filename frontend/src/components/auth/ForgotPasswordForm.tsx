"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  PlaneTakeoff,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  Button,
} from "@/components/ui";

export default function ForgotPasswordForm() {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!email.trim()) {
        return;
      }

      setLoading(true);

      try {
        console.log(
          "Password reset requested:",
          email,
        );

        /*
         * Later:
         *
         * await forgotPassword({
         *   email,
         * });
         */

        setSubmitted(true);
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324]/95 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      {/* Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#fb7185] via-[#fcd34d] to-transparent" />

      <div className="p-5 text-center sm:p-7">
        {/* Brand */}
        <Link
          href="/"
          className="inline-flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/10 text-[#fb7185]">
            <PlaneTakeoff
              size={17}
            />
          </div>

          <span className="voyage-gradient-text text-xl font-bold tracking-tight">
            VoyageAI
          </span>
        </Link>

        {!submitted ? (
          <>
            {/* Heading */}
            <div className="mt-7">
              <h1 className="text-2xl font-semibold tracking-tight text-[#e6e0e8]">
                Reset your password
              </h1>

              <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-[#948e9c]">
                Enter your email and we&apos;ll send you instructions to get back into your account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7"
            >
              <div className="text-left">
                <label
                  htmlFor="forgot-email"
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
                    id="forgot-email"
                    type="email"
                    value={
                      email
                    }
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

              <Button
                type="submit"
                fullWidth
                size="md"
                disabled={
                  loading ||
                  !email.trim()
                }
                className="mt-4 h-11"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}

                {!loading && (
                  <ArrowRight
                    size={15}
                  />
                )}
              </Button>
            </form>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="mt-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <CheckCircle2
                  size={21}
                />
              </div>

              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#e6e0e8]">
                Check your email
              </h1>

              <p className="mx-auto mt-2 max-w-[330px] text-sm leading-6 text-[#948e9c]">
                We&apos;ve sent password reset instructions to{" "}
                <span className="font-medium text-[#cbc4d2]">
                  {email}
                </span>
                .
              </p>

              <button
                type="button"
                onClick={() =>
                  setSubmitted(
                    false,
                  )
                }
                className="mt-5 text-xs font-semibold text-[#fb7185] transition hover:text-[#fcd34d]"
              >
                Use another email
              </button>
            </div>
          </>
        )}

        {/* Back */}
        <div className="mt-7 border-t border-white/10 pt-5">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#fb7185]"
          >
            <ArrowLeft
              size={13}
            />

            Back to Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}