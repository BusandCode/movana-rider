import { z } from "zod";

export const loginSchema = z.object({
  phoneOrEmail: z.string().min(3, "Enter your phone number or email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  vehicleType: z.enum(["bike", "motorcycle", "car", "van"]),
});

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
