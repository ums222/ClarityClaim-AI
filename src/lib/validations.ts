import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email format");

// Password validation
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup form schema
export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    organizationName: z.string().min(1, "Organization name is required"),
    organizationType: z.string().min(1, "Please select an organization type"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Contact form schema
export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: emailSchema,
  phone: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().optional(),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Demo request schema
export const demoRequestSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: emailSchema,
  phone: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  companySize: z.string().optional(),
  currentChallenges: z.string().optional(),
});

export type DemoRequestFormData = z.infer<typeof demoRequestSchema>;

// Newsletter schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Settings - Profile schema
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: emailSchema,
  phone: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Settings - Organization schema
export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: z.string().min(1, "Organization type is required"),
  npi: z.string().regex(/^\d{10}$/, "NPI must be 10 digits").optional().or(z.literal("")),
  taxId: z.string().optional(),
  address: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Settings - Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Appeal form schema
export const appealSchema = z.object({
  claimId: z.string().min(1, "Claim ID is required"),
  patientName: z.string().min(1, "Patient name is required"),
  patientDOB: z.string().min(1, "Patient DOB is required"),
  payerId: z.string().min(1, "Payer is required"),
  denialReason: z.string().min(1, "Denial reason is required"),
  serviceDate: z.string().min(1, "Service date is required"),
  amount: z.string().min(1, "Amount is required"),
  notes: z.string().optional(),
});

export type AppealFormData = z.infer<typeof appealSchema>;

// Helper function to get validation error messages
export function getValidationErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) return {};
  
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });
  return errors;
}
