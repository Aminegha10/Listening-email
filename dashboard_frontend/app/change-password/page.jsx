"use client";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Check,
  X,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useUpdatePasswordMutation } from "@/features/authApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const getStrengthText = () => {
    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Fair";
      case 4:
        return "Good";
      case 5:
        return "Strong";
      default:
        return "Weak";
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  if (!password) return null;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Password Strength</span>
        <span
          className={`font-medium ${
            strength >= 4
              ? "text-green-600"
              : strength >= 2
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {getStrengthText()}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-xs">
          {password.length >= 8 ? (
            <Check className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <X className="h-3 w-3 text-gray-400 mr-2" />
          )}
          <span
            className={
              password.length >= 8 ? "text-green-600" : "text-gray-500"
            }
          >
            At least 8 characters
          </span>
        </div>
        <div className="flex items-center text-xs">
          {/[A-Z]/.test(password) ? (
            <Check className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <X className="h-3 w-3 text-gray-400 mr-2" />
          )}
          <span
            className={
              /[A-Z]/.test(password) ? "text-green-600" : "text-gray-500"
            }
          >
            One uppercase letter
          </span>
        </div>
        <div className="flex items-center text-xs">
          {/[0-9]/.test(password) ? (
            <Check className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <X className="h-3 w-3 text-gray-400 mr-2" />
          )}
          <span
            className={
              /[0-9]/.test(password) ? "text-green-600" : "text-gray-500"
            }
          >
            One number
          </span>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  const { user, accessToken } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isLoading, isSuccess }] =
    useUpdatePasswordMutation();

  const newPassword = watch("newPassword", "");
  const confirmPassword = watch("confirmPassword", "");

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      const response = await updatePassword(data.newPassword).unwrap();

      if (response.success) {
        toast.success(response.message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Delay redirect to show the success message
        setTimeout(() => {
          router.replace("/login");
        }, 3000);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update password", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        }
      />

      <div className="w-full max-w-md">
        <div
          className="bg-card rounded-2xl border border-border p-8"
          style={{
            boxShadow: "0 0 5px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <KeyRound className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Update Password
            </h1>
            <p className="text-foreground text-sm">
              Please create a new secure password for your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full pl-12 pr-12 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-card text-card-foreground placeholder-muted-foreground"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.newPassword.message}
                </p>
              )}
              <PasswordStrengthIndicator password={newPassword} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full pl-12 pr-12 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 bg-card text-card-foreground placeholder-muted-foreground"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword.message}
                </p>
              )}
              {confirmPassword &&
                newPassword &&
                confirmPassword === newPassword && (
                  <div className="flex items-center mt-2 text-green-600 text-sm">
                    <Check className="h-4 w-4 mr-2" />
                    Passwords match
                  </div>
                )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary cursor-pointer hover:bg-primary/80 text-primary-foreground font-medium py-3 px-4 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              ) : (
                <>
                  {isSuccess ? (
                    <CheckCircle className="h-5 w-5 mr-2 text-white" />
                  ) : (
                    <Lock className="h-5 w-5 mr-2" />
                  )}
                  Update Password
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200 hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
