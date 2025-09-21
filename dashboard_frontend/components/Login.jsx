"use client";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../features/authApi";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const onSubmit = async (data) => {
    try {
      await login(data).unwrap();
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="relative py-3 sm:max-w-xs sm:mx-auto">
        <div className="min-h-96   px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900  rounded-xl shadow-lg">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center ">
              <div className=" text-red-500  ">
                <div className="w-12 h-12 border-4  border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : !isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <>
                <div className="flex flex-col justify-center items-center h-full select-none">
                  <div className="flex flex-col items-center justify-center gap-2 mb-8">
                    <a href="https://amethgalarcio.web.app/" target="_blank">
                      <img
                        src="https://amethgalarcio.web.app/assets/logo-42fde28c.svg"
                        className="w-8"
                      />
                    </a>
                    <p className="m-0 text-[16px] font-semibold dark:text-white">
                      Login to your Account
                    </p>
                    <span className="m-0 text-xs max-w-[90%] text-center text-[#8B8E98]">
                      Get started with our app, just start section and enjoy
                      experience.
                    </span>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label className="font-semibold text-xs text-gray-400 ">
                      Email
                    </label>
                    <input
                      className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                      placeholder="Username"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <label className="font-semibold text-xs text-gray-400 ">
                    Password
                  </label>
                  <input
                    type="password"
                    className="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none dark:border-gray-500 dark:bg-gray-900"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div className="mt-5">
                  <button
                    type="submit"
                    className="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
                  >
                    Login
                  </button>
                </div>
              </>
            </form>
          ) : (
            <>welcome to dashboard</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
