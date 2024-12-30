"use client";

import { signInSchema, signUpSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/features/auth/api/use-login";
import { useRegister } from "@/features/auth/api/use-register";

export const useSignIn = () => {
  const { mutate, isPending, data } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => mutate({ json: values }));

  return {
    register,
    onSubmit,
    errors,
    setValue,
    getValues,
    watch,
    isPending,
  };
};
export const useSignUp = () => {
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", name: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit((data) => mutate({ json: data }));
  return {
    register,
    onSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    isPending,
  };
};
