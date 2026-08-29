import {
  AuthShell,
} from "@/components/auth/auth-shell";

import {
  RegisterForm,
} from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Your next spot starts here"
      title={
        <>
          Find your next
          <br />
          favorite spot.
        </>
      }
      description="
        Discover cafés, coffee shops,
        milk-tea spots, and local favorites
        around Basilan.
      "
    >
      <RegisterForm />
    </AuthShell>
  );
}