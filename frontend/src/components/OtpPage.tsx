import React, { useState, useRef, useEffect, useContext } from "react";
import { Lock } from "lucide-react";
import { register, sendOtp, verifyOtp } from "../service/api/useApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { userContext } from "../context/context";
import ClipLoader from "react-spinners/ClipLoader";


const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useContext(userContext);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(10);
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string): void => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setIsValid(true);

    if (value !== "" && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      otp[index] === "" &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
setLoading(true)
    try {
       const otpValue = otp.join("");
    if (otpValue.length === 4) {
      const email = sessionStorage.getItem("email");
      const password = sessionStorage.getItem("password");
      const phoneNumber = sessionStorage.getItem("phoneNumber");
      const response = await verifyOtp(otpValue, email!);


      if (response.success) {
        const registerResponse = await register(
          email!,
          password!,
          phoneNumber!
        );

        if (registerResponse.success) {
          sessionStorage.clear();
          localStorage.setItem("userAuth", "true");
          localStorage.setItem("accessToken", registerResponse.accessToken);
          signup();
          navigate("/");
        } else {
          toast(registerResponse.message);
        }
      } else {
        console.log("error in otp");
        toast.error(response.message);
      }
    } else {
      setIsValid(false);
    }
    } catch (error) {
      toast.error('somthing went wrong')
      console.log(error);
      
    }finally{
      setLoading(false)
    }
   
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    const email = sessionStorage.getItem("email");
    const response = await sendOtp(email!);
    console.log("response", response);

    setTimer(10);
    setCanResend(false);
    toast.success("OTP resent successfully");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg transform transition-all hover:scale-105">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <Lock className="text-white" size={24} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Secure Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 4-digit code sent to your device
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className={`w-12 h-12 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 transition-all
                  ${
                    isValid
                      ? "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      : "border-red-500 focus:border-red-500 focus:ring-red-200"
                  }
                  ${digit ? "bg-blue-50" : "bg-white"}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          {!isValid && (
            <p className="text-red-500 text-center mb-4">
              Please enter all 4 digits.
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 transform hover:scale-105"
          >
            {loading?<ClipLoader/> : "Verify OTP"}
            
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Resend
            </button>
          ) : (
            <span className="text-gray-400">Resend in {timer} seconds</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
