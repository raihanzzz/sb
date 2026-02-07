import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userSignupSchema, type SignupInputState } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import {Loader2, LockKeyhole, Mail, Phone, User } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
//typescript me type define karne ka do tarika hota hai

// type SignupInputState = {
//   fullname:string;
//   email: string;
//   password: string;
//   contact:string;
// };

const Signup = () => {
  const [input, setInput] = useState<SignupInputState>({
    fullname:"",
    email:"",
    password:"",
    contact:"",
  });
  const [errors, setErrors] = useState<Partial<SignupInputState>>({});
  const{signup, loading} = useUserStore();
  const navigate = useNavigate();

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }
  const loginSubmitHandler = async (e:FormEvent) => {
    e.preventDefault(); //no page refresh after form submit
    // form validation check start
    const result = userSignupSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors as Partial<SignupInputState>);
      return;
    }


    //login api implementaiton start here
    try {
      const response = await signup(input);
      // Store token in local storage or pass via state to avoid relying on email
      // This solves the issue where trial email services limit recipients
      if (response && response.verificationToken) {
          navigate("/verify-email", { state: { verificationToken: response.verificationToken } });
      } else {
          navigate("/verify-email");
      }
    } catch (error) {
      console.error(error);
    }
    
    
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4 text-center">
        <div className="mb-4">
          <h1 className="font-bold text-2xl">SnapBite</h1>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Full Name"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />

            <User className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            {errors && <span className="text-xs text-red-500">{errors.fullname}</span>}
          </div>
        </div>



        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <Mail className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            {errors && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyhole className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            {errors && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Contact"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
              className="pl-10 focus-visible:ring-1"
            />
            <Phone className="absolute top-1/2 -translate-y-1/2 left-2 text-gray-500 pointer-events-none" />
            {errors && <span className="text-xs text-red-500">{errors.contact}</span>}
          </div>
        </div>

        <div className="mb-10">
          {loading ? (
            <Button disabled className="w-full bg-[var(--orange)] hover:bg-[var(--hoverOrange)]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full bg-[var(--orange)] hover:bg-[var(--hoverOrange)]">
              Signup
            </Button>
          )}
        </div>
        <Separator />
        <p className="mt-2">
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};
export default Signup;
