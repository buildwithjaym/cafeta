import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Your local coffee map"
      title={
        <>
          Your next cup
          <br />
          is waiting.
        </>
      }
      description="Sign in to return to your saved places, local discoveries, and the cafés you still want to try."
    >
      <LoginForm />
    </AuthShell>
  );
}