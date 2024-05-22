"use client";
import React from "react";
import { AuthCard } from "./auth-card";

const LoginForm = () => {
  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials
    >
      <h1>Login Form</h1>
    </AuthCard>
  );
};

export default LoginForm;
