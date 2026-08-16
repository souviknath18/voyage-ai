import LoginForm from "@/components/auth/LoginForm";
import LoginVisual from "@/components/auth/LoginVisual";

export default function LoginPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#0A0F1F]">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        <LoginForm />

        <LoginVisual />
      </div>
    </main>
  );
}