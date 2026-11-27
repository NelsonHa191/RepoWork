"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
        rememberMe: true,
      });

      if (error) {
        setError(error.message || "An error occurred during login");
        return;
      }

      if (data) {
        router.push("/"); // Redirect to home after successful login
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "An error occurred during Google sign in");
        return;
      }

      if (data) {
        router.push("/"); // Redirect to home after successful login
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Google sign in error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
