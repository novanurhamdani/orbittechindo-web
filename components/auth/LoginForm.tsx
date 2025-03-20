"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the login form schema with Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize react-hook-form with zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      await login({ email: values.email, password: values.password });
      // Redirect will happen automatically via useRedirectAuthenticated hook
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      className="space-y-6 p-8 glass rounded-xl shadow-2xl max-w-md w-full mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="space-y-2 text-center" variants={itemVariants}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-300">
          Enter your credentials to sign in to your account
        </p>
      </motion.div>

      {error && (
        <motion.div variants={itemVariants}>
          <Alert
            variant="destructive"
            className="border border-red-500/50 bg-red-500/10 backdrop-blur-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          variants={itemVariants}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      type="email"
                      disabled={isLoading}
                      className="pl-10 bg-black/20 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-gray-200">Password</FormLabel>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="pl-10 bg-black/20 border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm"
                    />

                    {showPassword ? (
                      <Eye
                        className="absolute right-2 top-2 w-4 z-10 cursor-pointer text-gray-500"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <EyeOff
                        className="absolute right-2 top-2 w-4 z-10 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 text-sm" />
              </FormItem>
            )}
          />

          <motion.div variants={itemVariants}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-none flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign in</span>
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </Form>

      <motion.div
        className="text-center text-sm text-gray-300"
        variants={itemVariants}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Sign up
        </Link>
      </motion.div>
    </motion.div>
  );
}
