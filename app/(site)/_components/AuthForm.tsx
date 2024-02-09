"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { startTransition, useCallback, useState, useTransition } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";

type variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const [variant, setVariant] = useState<variant>("LOGIN");
    const [isPending, startTranstion] = useTransition();

    const toggleVariant = useCallback(() => {
        variant === "LOGIN" ? setVariant("REGISTER") : setVariant("LOGIN");
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        startTranstion(() => {
            if(variant === "REGISTER") {
                // Register api
                }
            else {
                // LOGIN API
            }
        });
    }

    const socialAction = (action: string) => {
        startTransition(() => {
            // NEXT AUTHENTICATION SIGNIN action
        });
    }
    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-8">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {variant === "REGISTER" && (
                        <Input 
                        label="Name"
                        register={register} 
                        id="name"
                        errors={errors}
                        disabled={isPending}
                        />
                    )}
                    <Input 
                        label="Email"
                        register={register} 
                        id="email"
                        errors={errors}
                        type="email"
                        disabled={isPending}
                    />
                    <Input 
                        label="Password"
                        register={register} 
                        id="password"
                        errors={errors}
                        type="password"
                        disabled={isPending}
                    />
                    <div>
                        <Button disabled={isPending} fullWidth type="submit">
                            {variant === "LOGIN" ? "Sign In" : "Register"}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">
                                    Or sign up with social media
                                </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton Icon={BsGithub} onClick={() => socialAction("")}/>
                        <AuthSocialButton Icon={FaGoogle} onClick={() => socialAction("")} />
                    </div>
                </div>
                <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
                    <div>
                        {variant === "LOGIN" ? "New to messenger?" : "Already have an account?"}
                    </div>
                    <div className= "underline cursor-pointer" onClick={toggleVariant}>
                        {variant === "LOGIN" ? "Create an account..." : "Login"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthForm;