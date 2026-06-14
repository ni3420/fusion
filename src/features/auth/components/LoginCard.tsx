"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginCardProps {
  onSwitchToRegister: () => void;
}

export default function LoginCard({ onSwitchToRegister }: LoginCardProps) {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectUrl = searchParams.get("redirect") || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    setError(null);
    try {
      await signIn("password", { 
        email: data.email, 
        password: data.password, 
        flow: "signIn" 
      });
    //   window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setIsPending(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsPending(true);
    setError(null);
    try {
      await signIn(provider, { redirectTo: redirectUrl });
    } catch (err) {
      console.error(err);
      setError(`Failed to sign in with ${provider}`);
      setIsPending(false);
    }
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm rounded-xl">
      <CardHeader className="space-y-1.5 pt-6 px-6">
        <CardTitle className="text-2xl font-semibold tracking-tight text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
          Enter your credentials to access your workspace
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grid gap-4 px-6">
        {error && (
          <div className="p-3 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isPending}
              className="h-10 border-neutral-200 dark:border-neutral-800 bg-transparent focus-visible:ring-neutral-400"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isPending}
                className="h-10 pr-10 border-neutral-200 dark:border-neutral-800 bg-transparent focus-visible:ring-neutral-400"
                {...register("password")}
              />
              <button
                type="button"
                disabled={isPending}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" disabled={isPending} className="w-full h-10 mt-2 font-medium bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign In with Email
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => handleOAuthLogin("google")}
            className="h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <FcGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => handleOAuthLogin("github")}
            className="h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <FaGithub className="mr-2 h-4 w-4 text-neutral-900 dark:text-neutral-100" />
            GitHub
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4 pb-6 px-6">
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 w-full">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            disabled={isPending}
            onClick={onSwitchToRegister}
            className="font-medium text-neutral-900 dark:text-neutral-100 underline underline-offset-4 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Sign up
          </button>
        </p>
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure authentication lifecycle</span>
        </div>
      </CardFooter>
    </Card>
  );
}