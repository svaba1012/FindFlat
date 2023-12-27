"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import CustomInput from "../components/CustomInput";
import ErrorList from "../components/ErrorList";
import { useRequest } from "../hooks/useRequest";
import { useRouter } from "next/navigation";

function SigninForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let reqHook = useRequest(
    process.env.NEXT_PUBLIC_SERVER_URL + "/api/users/signin",
    "post"
  );
  let router = useRouter();

  const onSubmit = async (submitData) => {
    console.log(submitData);
    let res = await reqHook.doRequest(submitData);

    if (res && !res.verified) {
      router.push("/auth/verify");
    }
  };
  return (
    <form
      className="tw-h-fit tw-p-7 border tw-rounded-md tw-border-col3 tw-max-w-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2>Signin</h2>
      <CustomInput
        inputProps={{
          ...register("emailOrUsername", {
            required: "Email or username is required",
          }),
          placeholder: "Email or username",
        }}
        id={"emailOrUsername"}
        label={"Username or email"}
        validationError={errors.emailOrUsername}
        icon={<i className="fa-solid fa-user"></i>}
      />
      <CustomInput
        inputProps={{
          ...register("password", {
            required: "Password is required",
          }),
          placeholder: "Password",
          type: "password",
        }}
        id={"password"}
        label={"Password"}
        validationError={errors.password}
        icon={<i className="fa-solid fa-lock"></i>}
      />
      <div>
        <Link href="/auth/signup">
          Don't have an account, signup with new one
        </Link>
      </div>

      <ErrorList errors={reqHook.errors} />

      <button
        type="submit"
        className="btn btn-lg tw-bg-primary tw-text-text tw-mt-3"
      >
        Signin
      </button>
    </form>
  );
}

export default SigninForm;
