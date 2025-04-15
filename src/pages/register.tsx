
import { Layout } from "@/components/layout/layout";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
}
