import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../socialLogin/SocialLogin";

const Login = () => {

  const  {sinInUser} = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLoginSubmit = (data) => {
    console.log(data);

    sinInUser(data.email, data.password)
    .then(result => {
      console.log(result.user);
      navigate(location?.state || '/')
    })
    .catch(error => {
      console.log(error);
      
    })
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
      <h2 className="text-3xl text-center p-4">Welcome back</h2>
        <p className="p-4 text-center">Please login</p>
      <div className="card-body">
        <form onSubmit={handleSubmit(handleLoginSubmit)}>
          <fieldset className="fieldset">
            {/* email */}
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email",{required: true})}
              className="input"
              placeholder="Email"
            />
            {errors.email?.type === 'required' && <p className="text-red-500">Email is required</p>}

            {/* password */}
            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "minLength" && (
              <p className="text-red-500">Password must be 6 characters or longer</p>
            )}

            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-neutral mt-4">Login</button>
          </fieldset>
          <p>New to zap Shift <Link state={location?.state} className="text-blue-400 underline" to={'/register'}>Register</Link></p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
