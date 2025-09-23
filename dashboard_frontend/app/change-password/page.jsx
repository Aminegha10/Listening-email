"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUpdatePasswordMutation } from "../../features/authApi";

const Page = () => {
  const router = useRouter();
  const { user, accessToken } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   if (!accessToken) {
  //     router.push("/login"); // ✅ This is safe
  //   }
  // }, [accessToken, router]);
  //   if (!accessToken) {
  //     // no temp session → redirect & to login reload-->login
  //     return router.replace("/login");
  //   }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const onSubmit = async (data) => {
    if (data.newPassword != data.confirmPassword) {
      // taost here plz
      console.log("confirmation failed");
    }
    try {
      await updatePassword(data.newPassword).unwrap();
      router.replace("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="items-center justify-center flex h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <KeyRound className="h-12 w-12 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Update Password
          </CardTitle>
          <CardDescription className="text-center">
            Please create a new secure password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password
            <div>
              <label className="block mb-1 font-medium">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter your current password"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div> */}

            {/* New Password */}
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block mb-1 font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <Button
                type="submit"
                className="w-full cursor-pointer"
                // disabled={isSubmitting}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
              {/* <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
              >
                Cancel
              </Button> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
