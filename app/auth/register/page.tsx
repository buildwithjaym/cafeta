import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Local discovery starts here"
      title={
        <>
          Find your next
          <br />
          “Kape tayo.”
        </>
      }
      description="Join CAFÉTA and turn the places around you into a collection of cafés, milk-tea shops, and local experiences worth remembering."
    >
      <RegisterForm />
    </AuthShell>
  );
}