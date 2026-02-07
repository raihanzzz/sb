import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import React, { useState, useRef, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const { loading, verifyEmail } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const verifyToken = location.state?.verificationToken;

  useEffect(() => {
     if(verifyToken) {
         setOtp(verifyToken.split(""));
         toast.info("DEMO MODE: Verification code auto-filled for testing.");
     }
  }, [verifyToken]);

  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    // move to the next input foeld if digit is entered
    if (value !== "" && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    try {
      await verifyEmail(verificationCode);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <div>
          <form onSubmit={submitHandler}>
            <div className="flex justify-between">
              {otp.map((letter: string, idx: number) => (
                <Input
                  key={idx}
                  ref={(element) => {
                    inputRef.current[idx] = element;
                  }}
                  type="text"
                  maxLength={1}
                  value={letter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(idx, e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    handleKeyDown(idx, e)
                  }
                  className="md:w-12 md:h-12 w-11 h-11 md:text-2xl text-lg font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-300 text-center mx-0.5 p-0"
                />
              ))}
            </div>
            {loading ? (
              <Button
                disabled
                className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)] mt-6 w-full"
              >
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-[var(--orange)] hover:bg-[var(--hoverOrange)] mt-6 w-full">
                Verify
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default VerifyEmail;
