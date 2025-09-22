import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Eye, EyeOff, CheckCircle, Shield, Key, X } from "lucide-react";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useRegisterMutation } from "../../features/authApi";

const addUserForm = () => {
  const [registerMutation, { isLoading }] = useRegisterMutation();
  // const [tempPassword, setTempPassword] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.tempPassword);
      setCopied(true);
      console.log("copied success");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("failed copied", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await registerMutation(data).unwrap();
      console.log("Registration response:", response);
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        tempPassword: response.tempPassword,
      });
      // setTempPassword(response.tempPassword);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <UserPlus /> Add user
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          {!formData ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="mb-4">Add User</DialogTitle>
              </DialogHeader>

              <div className="grid gap-4 mb-4">
                <div className="grid gap-3">
                  <span htmlFor="name-1">Name</span>
                  <Input
                    className="shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(27,31,35,0.15)]"
                    {...register("name", { required: "Name is required" })}
                    id="name-1"
                    placeholder="Enter user name"
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                </div>

                <div className="grid gap-3">
                  <span htmlFor="email-1">Email</span>
                  <Input
                    className="shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(27,31,35,0.15)]"
                    {...register("email", { required: "Email is required" })}
                    id="email-1"
                    placeholder="user123@example.com"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {" "}
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: "Role is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value} // bind current value
                        onValueChange={field.onChange} // update RHF on change
                      >
                        <SelectTrigger className="shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(27,31,35,0.15)]">
                          <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Role</SelectLabel>
                            <SelectItem value="user">
                              <Badge className="text-xs bg-gray-500">
                                User
                              </Badge>
                            </SelectItem>
                            <SelectItem value="admin">
                              <Badge className="text-xs bg-blue-500">
                                Admin
                              </Badge>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {/* <Badge className="bg-yellow-300">tempPass: {tempPassword}</Badge> */}
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          ) : (
            <>
              <div className="space-y-6 password-reveal">
                {/* Success Header */}
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      User Created Successfully!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.name} has been added to your team
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <Card className="bg-muted/30 border-border">
                  <CardContent className="p-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Email:
                      </span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Role:
                      </span>
                      <Badge
                        variant={
                          formData.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {formData.role}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Temporary Password Section */}
                <Card className="bg-warning/5 border-warning/20">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2 text-warning">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        Temporary Password Generated
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-border">
                        <Key className="w-4 h-4 text-muted-foreground" />
                        <code className="flex-1 font-mono text-sm">
                          {showPassword
                            ? formData.tempPassword
                            : "••••••••••••"}
                          {/* {showPassword ? "zadzefzef" : "••••••••••••"} */}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-6 w-6 p-0"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3 h-3" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                          className={`h-6 w-6 p-0 ${
                            copied ? "copy-success" : ""
                          }`}
                        >
                          <Copy
                            className={`w-3 h-3 ${
                              copied ? "text-success" : ""
                            }`}
                          />
                        </Button>
                      </div>

                      {/* <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          • This password is temporary and should be changed on
                          first login
                        </p>
                        <p>• Share this password securely with the user</p>
                        <p>• Password expires in 24 hours if not used</p>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex-1 gap-2 bg-transparent"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Password"}
                  </Button>
                  <Button
                    // onClick={handleClose}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default addUserForm;
