import SignupForm from "@/components/auth/SignupForm";
import SignupVisual from "@/components/auth/SignupVisual";

export default function SignupPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[#0A0F1F]">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
        <SignupForm />

        <SignupVisual />
      </div>
    </main>
  );
}