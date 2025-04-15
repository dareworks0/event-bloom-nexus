
import { Layout } from "@/components/layout/layout";
import { LoginForm } from "@/components/forms/login-form";
import { Calendar } from "lucide-react";

export default function LoginPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto py-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4 animate-float">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">EventHub</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to manage your events</p>
        </div>
        <LoginForm />
      </div>
    </Layout>
  );
}
