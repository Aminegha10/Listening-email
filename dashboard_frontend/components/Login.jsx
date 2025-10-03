"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  Lock,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useLoginMutation } from "@/features/authApi";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, isSuccess }] = useLoginMutation();
  const [newUser, setNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      if (res.user.newUser) {
        setNewUser(true);
        router.push("/change-password");
      } else {
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000); // 3 seconds delay
        // router.push("/dashboard");
      }
    } catch (err) {
      // Handle specific error messages
      toast.error(err?.data?.message || "Login failed", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleGoogleLogin = async () => {
    toast.warning("Google login is not implemented yet", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleGithubLogin = async () => {
    toast.warning("GitHub login is not implemented yet", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      {/* Add ToastContainer at the root level */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <>
        {!isSuccess ? (
          // Enhanced Login form
          <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4 overflow-visible relative">
            {/* Background layers */}
      
            {/* Card */}
            <Card
              style={{
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 0px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
              }}
              className="w-full max-w-md relative z-10 dark:bg-card shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-0 dark:border-2 bg-white/95  backdrop-blur-xl"
            >
              <CardHeader className="space-y-4 pb-4">
                <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center text-slate-600 dark:text-slate-400 text-base">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 hover:bg-primary/40  dark:hover:bg-slate-800 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 group"
                    onClick={handleGoogleLogin}
                  >
                    <GoogleIcon />
                    <span className="ml-3 font-medium">
                      Continue with Google
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2  hover:bg-primary/40 dark:hover:bg-slate-800 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 group"
                    onClick={handleGithubLogin}
                  >
                    <Github className="w-5 h-5" />
                    <span className="ml-3 font-medium">
                      Continue with GitHub
                    </span>
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <Separator className="bg-slate-200 dark:bg-slate-700" />
                  <div className="absolute inset-0 flex justify-center">
                    <span className="bg-white dark:bg-slate-900 px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      or continue with email
                    </span>
                  </div>
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600  group-focus-within:text-white-600 dark:group-focus-within:text-white transition-colors duration-200 w-5 h-5" />
                      <Input
                        className="pl-11 pr-11 h-12 border- dark:border-1 border-slate-200 dark:border-primary  dark:focus:border-primary rounded-xl bg-slate-50/50 dark:bg-primary/20 transition-all duration-200 "
                        id="email"
                        type="email"
                        defaultValue={"oussama214@smab.com"}
                        placeholder="username@smab.com"
                        {...register("email", {
                          required: "Email is required",
                        })}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1 animate-in slide-in-from-left-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-white transition-colors duration-200 w-5 h-5" />
                      <Input
                        className="pl-11 pr-11 h-12 border-2 dark:border-1 border-slate-200 dark:border-primary focus:border-primary dark:focus:border-primary rounded-xl bg-slate-50/50 dark:bg-primary/20 transition-all duration-200 "
                        id="password"
                        defaultValue={"azertyui"}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 p-1"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1 animate-in slide-in-from-left-1">
                        <span className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
                      onClick={() => console.log("Forgot password clicked")}
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    // className="w-full cursor-pointer"
                    className="w-full h-12   hover:to-slate-700 cursor-pointer text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : !newUser ? (
          // Success User already changed their password
          <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-teal-900/20 flex flex-col items-center justify-center text-center space-y-8 p-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl w-32 h-32 -top-4 -left-4" />
              <CheckCircle className="h-24 w-24 text-emerald-500 relative z-10 drop-shadow-lg" />
            </div>
            <div className="space-y-4 max-w-md">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Welcome Back, {user.name.toUpperCase()}!
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                You have successfully logged in. Redirecting to your
                dashboard...
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          // New User needs to update password
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-slate-900 dark:via-orange-900/20 dark:to-amber-900/20 flex flex-col items-center justify-center text-center space-y-8 p-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl w-32 h-32 -top-4 -left-4" />
              <KeyRound className="h-24 w-24 text-orange-500 relative z-10 drop-shadow-lg" />
            </div>
            <div className="space-y-4 max-w-md">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                Welcome!
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                For security reasons, please update your password to continue.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </>
    </>
  );
};

export default Login;
