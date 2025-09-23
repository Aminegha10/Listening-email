"use client";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../features/authApi";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [newUser, setNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res.user.newUser) {
        setNewUser(true);
        router.push("/change-password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {!isSuccess ? (
        // Login form
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className=" shadow-sm"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      className="shadow-sm"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </div>
                {/* Submit */}
                <Button type="submit" className="w-full cursor-pointer">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2  h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : !newUser ? (
        // Success User already chnaged its password
        <div className="flex flex-col w-full h-screen items-center justify-center text-center space-y-6">
          <CheckCircle className="h-24 w-24 text-teal-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Welcome Amine!
            </h2>
            <p className="text-muted-foreground">
              You have successfully logged in.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        // New User need to update its password
        <div className="flex flex-col  w-full h-screen items-center justify-center text-center space-y-6">
          {/* Updated icon to KeyRound with orange color for password renewal */}
          <KeyRound className="h-24 w-24 text-orange-500" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Welcome!</h2>
            <p className="text-muted-foreground">
              You've been redirected to change your password
            </p>
          </div>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          </div>
          {/* we need to add here three dots animation */}
        </div>
      )}
    </>
  );
};

export default Login;
