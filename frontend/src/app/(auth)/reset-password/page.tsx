import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0A0F1F] px-4 py-8">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#fb7185]/[0.07] blur-[120px]" />

        <div className="absolute -bottom-36 -right-24 h-[420px] w-[420px] rounded-full bg-[#fcd34d]/[0.05] blur-[120px]" />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2e1065]/20 blur-[140px]" />
      </div>

      <ResetPasswordForm />
    </main>
  );
}