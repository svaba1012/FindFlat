"use client";
import React from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";

import CustomInput from "../../src/components/CustomInput";
import ErrorList from "../../src/components/ErrorList";
import { useRequest } from "../hooks/useRequest";
import { useRouter } from "next/navigation";

function SignupForm(props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  let req = useRequest(process.env.NEXT_PUBLIC_SERVER_URL + "/api/users/signup", "post");
  let router = useRouter();

  const onSubmit = async (formData) => {
    let { username, email } = formData;
    let password = formData.password1;
    let res = await req.doRequest({ username, email, password });

    console.log(res);

    if (res && !res.verified) {
      router.push("/auth/verify");
    }
  };
  return (
    <form
      className="tw-h-fit tw-p-7 border tw-rounded-md tw-border-col3 tw-max-w-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2>Signup</h2>

      <CustomInput
        inputProps={{
          ...register("username", {
            minLength: {
              value: 4,
              message: "Username must be betwean 4 and 20 chars!",
            },
            maxLength: {
              value: 20,
              message: "Username must be betwean 4 and 20 chars!",
            },
            required: "Username must be betwean 4 and 20 chars!",
          }),
          placeholder: "Username",
        }}
        id={"username"}
        label={"Username"}
        validationError={errors.username}
        icon={<i className="fa-solid fa-user"></i>}
      />

      <CustomInput
        inputProps={{
          ...register("email", {
            required: "Email must be valid",
            validate: (value: string) => {
              if (
                value.indexOf("@") > -1 &&
                value.indexOf(".") > value.indexOf("@") &&
                value.indexOf(".") < value.length - 1
              ) {
                return;
              }
              return "Email must be valid";
            },
          }),
          placeholder: "Email",
        }}
        id={"email"}
        label={"Email"}
        validationError={errors.email}
        icon={<i className="fa-solid fa-at"></i>}
      />

      <CustomInput
        inputProps={{
          ...register("password1", {
            required: "Password must be betwean 4 and 20 chars",
            minLength: {
              value: 4,
              message: "Password must be betwean 4 and 20 chars!",
            },
            maxLength: {
              value: 20,
              message: "Password must be betwean 4 and 20 chars!",
            },
          }),
          placeholder: "Password",
          type: "password",
        }}
        id={"password1"}
        label={"Password"}
        validationError={errors.password1}
        icon={<i className="fa-solid fa-lock"></i>}
      />

      <CustomInput
        inputProps={{
          ...register("password2", {
            required: "Password must be betwean 4 and 20 chars!",
            minLength: {
              value: 4,
              message: "Password must be betwean 4 and 20 chars!",
            },
            maxLength: {
              value: 20,
              message: "Password must be betwean 4 and 20 chars!",
            },
            validate: (value) => {
              return watch("password1") != value
                ? "Passwords must match!"
                : null;
            },
          }),
          placeholder: "Repeated password",
          type: "password",
        }}
        id={"password2"}
        label={"Repeated password"}
        validationError={errors.password2}
        icon={<i className="fa-solid fa-lock"></i>}
      />

      <div>
        <Link href="/auth/signin">Already have an account, signin</Link>
      </div>

      <ErrorList errors={req.errors} />

      <button className="btn btn-lg tw-bg-primary tw-text-text tw-mt-3">
        Signup
      </button>
    </form>
  );
}

export default SignupForm;
