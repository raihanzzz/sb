import {z} from "zod";

export const userSignupSchema = z.object({
    fullname:z.string().min(1,"Full name is required"),
    email: z.email({ error: "Invalid email address" }),
    password:z.string().min(6,"Password must be atleast 6 characters"),
    contact:z.string().min(10,"Contact number must be 10 digit"),
})

export type SignupInputState = z.infer<typeof userSignupSchema>

export const userLoginSchema = z.object({
    email: z.email({ error: "Invalid email address" }),
    password:z.string().min(6,"Password must be atleast 6 characters"),
})

export type LoginInputState = z.infer<typeof userLoginSchema>