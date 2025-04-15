
import { Layout } from "@/components/layout/layout";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <LoginForm />
      </div>
    </Layout>
  );
}
