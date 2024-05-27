"use client";
import React, { useState } from "react";
import { AuthCard } from "./auth-card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "@/types/zod-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { emailSignIn } from "@/server/actions/auth-actions";
import { useAction } from "next-safe-action/hooks";
import { FormSuccess } from "./form-success";
import { FormError } from "./form-error";

const LoginForm = () => {
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);

  const { execute, status } = useAction(emailSignIn, {
    onSuccess(data) {
      if (data?.error) setError(data.error);
      if (data?.success) {
        setSuccess(data.success);
      }
      // if (data?.twoFactor) setShowTwoFactor(true);
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    if (success) setSuccess("");
    if (error) setError("");
    execute(data);
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              {showTwoFactor && (
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {`We've sent you a two factor code to your email.`}
                      </FormLabel>
                      <FormControl>
                        {/* <InputOTP */}
                        {/*   disabled={status === "executing"} */}
                        {/*   {...field} */}
                        {/*   maxLength={6} */}
                        {/* > */}
                        {/*   <InputOTPGroup> */}
                        {/*     <InputOTPSlot index={0} /> */}
                        {/*     <InputOTPSlot index={1} /> */}
                        {/*     <InputOTPSlot index={2} /> */}
                        {/*     <InputOTPSlot index={3} /> */}
                        {/*     <InputOTPSlot index={4} /> */}
                        {/*     <InputOTPSlot index={5} /> */}
                        {/*   </InputOTPGroup> */}
                        {/* </InputOTP> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!showTwoFactor && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="jondeo@gmail.com"
                            type="email"
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="*********"
                            type="password"
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormDescription />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormSuccess message={success} />
              <FormError message={error} />
              <Button size={"sm"} className="px-0" variant={"link"} asChild>
                <Link href="/auth/reset">Forgot your password</Link>
              </Button>
            </div>
            <Button
              type="submit"
              className={cn(
                "my-4 w-full",
                status === "executing" ? "animate-pulse" : "",
              )}
            >
              {showTwoFactor ? "Verify" : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};

export default LoginForm;
