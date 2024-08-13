'use client'
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/router';

interface SignUpData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};
  
const SignUp = ()  => {

  // const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch,
      } = useForm<SignUpData>();
  const searchParams = useSearchParams();
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('https://akil-backend.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: "user",
        }),
      });
      
      // if (!res.ok) {
      //   throw new Error('Signup failed');
      // }

      console.log(res)

      const result = await res.json();
      setLoading(false);
      if (res.ok) {
        localStorage.setItem("signUpEmail", data.email);
        console.log("result:", result)
        const returnUrl = searchParams.get("returnUrl") || "/auth/verify-email";
        window.location.href = returnUrl;
        // router.
      }else {
        setError(result.message || "Signup failed");
      }
    }catch (error) {
      console.log('signup error:', error);
      setError('Please contact support for assistance.')
    }finally {
      setLoading(false);
    }
  }; 
    
    const password = watch("password");
    // const confirmPassword = watch("confirmPassword");
   
  return (
    <div className="flex flex-col m-6 justify-center items-center min-h-screen">
      <div>
        <h1 className='font-extrabold text-3xl mt-3 mb-3'>Sign Up Today!</h1>
        <button onClick={() => signIn("google")} className="flex items-center px-8 py-3 rounded-lg border font-bold text-blue-700">
          <FcGoogle className="mr-3 size={28}" />
          Sign Up with Google
        </button>
      </div>

      <div className='flex items-center justify-center gap-4 space-x my-6'>
        <span className='w-1/4 border-b'></span>
        <span className=' border-gray-500'>Or Sign Up with Email</span>
        <span className='w-1/4 border-b'></span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <label htmlFor="fullName" className='font-bold mt-3'>Full Name:</label>
          <input
            id="fullName"
            type="text"
            placeholder='Enter your full name'
            className='border w-full px-5'
            {...register("fullName", { required: true })}
          />
          {errors.fullName && <p className='error'>Fullname is required</p>}
        </div>

        <div>
          <label htmlFor="email" className='font-bold mt-3'>Email Address:</label>
          <input
            type="email"
            id="email"
            placeholder='Enter email address'
            className='border w-full px-5'
            {...register("email", {
              required: true, 
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email is required"
              },
            })}
          />
          {errors.email && <p className='error'>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className='font-bold mt-3'>Password:</label>
          <input
            type="password"
            id="password"
            placeholder='Enter password'
            className='border w-full px-5'
            {...register("password", { required: true })}
          /> 
          {errors.password && <p className='error'>Password is required</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className='font-bold mt-3'>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder='Enter password'
            className='border w-full px-5'
            {...register('confirmPassword', { required: true })}
          />
           {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword.message}
            </p>
            )}
        </div>

        <button className=' bg-blue-900 py-3 w-full item-center rounded-full text-white border' type="submit">Continue</button>
      </form>
      <div className="flex m-4">
        <p className='mx-2'>Already have an account?</p>
        <a  href="/auth/signin" className="text-blue-800">Login</a>
      </div>
      
      <div className='flex flex-col m-6 justify-center items-center '>
        <p className=" text-gray-600 mb-6">
            We've sent a verification code to the email address you provided. To
            complete the verification process, please enter the code here.
        </p>
      </div>
    </div>

  );
  };


export default SignUp;
