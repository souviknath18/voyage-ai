"use client";

import Link from "next/link";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Lock,
  PlaneTakeoff,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  Button,
} from "@/components/ui";

type ResetState =
  | "form"
  | "success"
  | "expired";

export default function ResetPasswordForm() {
  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    state,
    setState,
  ] =
    useState<ResetState>(
      "form",
    );

  const hasLength =
    password.length >= 8;

  const hasNumber =
    /\d/.test(
      password,
    );

  const hasSpecial =
    /[!@#$%^&*(),.?":{}|<>]/.test(
      password,
    );

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password ===
      confirmPassword;

  const passwordValid =
    hasLength &&
    hasNumber &&
    hasSpecial;

  const formValid =
    passwordValid &&
    passwordsMatch;

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (!formValid) {
        return;
      }

      setLoading(true);

      try {
        console.log(
          "Reset password",
        );

        /*
         * Later:
         *
         * const token =
         *   searchParams.get(
         *     "token",
         *   );
         *
         * await resetPassword({
         *   token,
         *   password,
         * });
         */

        setState(
          "success",
        );
      } catch (
        error
      ) {
        console.error(
          error,
        );

        /*
         * Later:
         * If API says token is
         * expired/invalid:
         *
         * setState(
         *   "expired",
         * );
         */
      } finally {
        setLoading(false);
      }
    };

  return (
    <section className="relative z-10 w-full max-w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-[#0D1324]/95 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
      {/* Accent */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#fb7185] to-transparent" />

      <div className="p-5 sm:p-7">
        {/* Brand */}
        <div className="text-center">
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
        </div>

        {state ===
          "form" && (
          <>
            {/* Heading */}
            <div className="mt-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-[#e6e0e8]">
                Reset your password
              </h1>

              <p className="mx-auto mt-2 max-w-[330px] text-sm leading-6 text-[#948e9c]">
                Choose a strong new password for your VoyageAI account.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-7 space-y-4"
            >
              {/* New Password */}
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#948e9c]"
                >
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f8798]"
                  />

                  <input
                    id="new-password"
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
                    autoComplete="new-password"
                    placeholder="Enter new password"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#948e9c]"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7f8798]"
                  />

                  <input
                    id="confirm-new-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      confirmPassword
                    }
                    onChange={(
                      event,
                    ) =>
                      setConfirmPassword(
                        event.target
                          .value,
                      )
                    }
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-10 pr-11 text-sm text-[#e6e0e8] outline-none transition placeholder:text-[#596174] focus:border-[#fb7185]/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#fb7185]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (
                          previous,
                        ) =>
                          !previous,
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-[#7f8798] transition hover:bg-white/[0.05] hover:text-[#cbc4d2]"
                  >
                    {showConfirmPassword ? (
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

                {confirmPassword &&
                  !passwordsMatch && (
                    <p className="mt-1.5 text-[11px] text-[#fb7185]">
                      Passwords do not match.
                    </p>
                  )}
              </div>

              {/* Requirements */}
              <div className="rounded-xl border border-white/10 bg-[#070B18]/70 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7f8798]">
                  Password Requirements
                </p>

                <div className="mt-3 space-y-2">
                  <Requirement
                    valid={
                      hasLength
                    }
                    label="At least 8 characters"
                  />

                  <Requirement
                    valid={
                      hasNumber
                    }
                    label="Contains a number"
                  />

                  <Requirement
                    valid={
                      hasSpecial
                    }
                    label="Contains a special character"
                  />
                </div>
              </div>

              {/* Reset */}
              <Button
                type="submit"
                fullWidth
                size="md"
                disabled={
                  loading ||
                  !formValid
                }
                className="h-11"
              >
                {loading
                  ? "Updating..."
                  : "Reset Password"}

                {!loading && (
                  <ArrowRight
                    size={15}
                  />
                )}
              </Button>
            </form>

            {/* Demo only */}
            <button
              type="button"
              onClick={() =>
                setState(
                  "expired",
                )
              }
              className="mx-auto mt-4 block text-[11px] text-[#596174] transition hover:text-[#948e9c]"
            >
              Simulate expired reset link
            </button>
          </>
        )}

        {state ===
          "success" && (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
              <Check
                size={24}
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[#e6e0e8]">
              Password reset complete
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-[#948e9c]">
              Your password has been successfully updated. You can now sign in using your new password.
            </p>

            <Link
              href="/login"
              className="mt-6 block"
            >
              <Button
                fullWidth
                size="md"
                className="h-11"
              >
                Return to Login

                <ArrowRight
                  size={15}
                />
              </Button>
            </Link>
          </div>
        )}

        {state ===
          "expired" && (
          <div className="py-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-400">
              <AlertTriangle
                size={23}
              />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-red-300">
              Reset link expired
            </h1>

            <p className="mx-auto mt-2 max-w-[320px] text-sm leading-6 text-[#948e9c]">
              For your security, password reset links expire after a limited time. Request a new link to continue.
            </p>

            <div className="mt-6 space-y-2">
              <Link
                href="/forgot-password"
                className="block"
              >
                <Button
                  fullWidth
                  size="md"
                  className="h-11"
                >
                  Request New Link
                </Button>
              </Link>

              <Button
                fullWidth
                variant="outline"
                size="md"
                onClick={() =>
                  setState(
                    "form",
                  )
                }
                className="h-11"
              >
                Back to Reset
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {state !==
          "success" && (
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#948e9c] transition hover:text-[#fcd34d]"
            >
              <ArrowLeft
                size={13}
              />

              Back to Login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function Requirement({
  valid,
  label,
}: {
  valid: boolean;

  label: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        valid
          ? "text-[#cbc4d2]"
          : "text-[#7f8798]"
      }`}
    >
      {valid ? (
        <CheckCircle2
          size={14}
          className="shrink-0 text-[#fb7185]"
        />
      ) : (
        <Circle
          size={14}
          className="shrink-0"
        />
      )}

      {label}
    </div>
  );
}