'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface VerifyEmailProps {
  email: string;
}

const VerifyEmail = ({email}: VerifyEmailProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  // timer count
  useEffect(() => {
    if (timer === 0) 
      return;
    const interval = setInterval(() => {
      setTimer((prev) => prev -1);
    }, 1000);
  }, [timer]);

  // otp change
  const handelOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    index: number
  ) => {
    const value = e.target.value;
    
    
    // Handle backspace and delete
    if (/^\d*$/.test(value) || value === '')  {
      const newOtp = [...otp];
      newOtp[index] = value;
        // const prevInput = document.querySelector(`#otp-input-${index - 1}`) as HTMLInputElement;
        // prevInput?.focus();
      
      setOtp(newOtp);
      
    // Limit input to one digit per field
      if (value.length >1) {
        newOtp[index] = value[0];
      } else {
        newOtp[index] = value;
      }
    

      // Focus on the next input if it's not the last one and a digit is entered
      if (value && index <3) {
        const nextInput = document.querySelector(`#otp-input-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
    }
  };
};
 
  // const handleOtpChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ) => {
  //   const value = e.target.value;
  //   if (/^\d$/.test(value) || value === "") {
  //     const newOtp = [...otp];
  //     newOtp[index] = value;
  //     setOtp(newOtp);

  //     if (value && index < 3) {
  //       const nextInput = document.querySelector(
  //         `#otp-input-${index + 1}`
  //       ) as HTMLInputElement;
  //       nextInput?.focus();
  //     }
  //   }
  // };

  // handel verification
  const handleVerify = async() => {
    setLoading(true)
    setError(null);

    const otpCode = otp.join("");
    const email = localStorage.getItem("signUpEmail");

    if (!email) {
      setError("Email not found. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://akil-backend.onrender.com/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          { email,
            OTP: otpCode }
        ),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('OTP verified')
        localStorage.removeItem("signUpEmail");
        router.push("/auth/signin");
      }else {
        setError(data.message || 'Invalid OTP')
      }

    }catch(error) {
      console.error('Error verifying OTP:', error);
      setError('An error occurred while verifying OTP');
    }finally {
      setLoading(false);
    } 
  };
 

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-12 rounded-lg w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center">
          Verify Email
        </h1>
  
        <p className="text-center text-gray-600 mb-6">
          We've sent a verification code to the email address you provided. To
          complete the verification process, please enter the code here.
        </p>
  
        <div className="flex justify-center mb-6 m-16">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={value}
              onChange={(e) => handelOtpChange(e, index)}
              className="w-12 h-10 text-center border border-blue-800 p-4 mx-4 rounded-s focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={1}
            />
          ))}
        </div>
          
        <div className="text-center mt-4">
          <button
            className="text-indigo-600 hover:underline"
            disabled={resendDisabled || timer > 0} // Disable resend if disabled or timer running
            onClick={() => {
              setResendDisabled(true); // Disable resend button temporarily
              setTimer(30); // Reset timer
            }}
          >
            {timer > 0 ? `You can request to resend OTP in ${timer}` : "Resend OTP"}
          </button>

        <button
          className="w-full py-3 mt-8 text-white bg-indigo-900 rounded-full hover:bg-indigo-700"
          // Disable submit if loading or all fields aren't filled
          disabled={loading || !otp.every((val) => val !== '')} 
          onClick={handleVerify}
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
        </div>

      </div>
    </div>
  );
}; 
export default VerifyEmail;