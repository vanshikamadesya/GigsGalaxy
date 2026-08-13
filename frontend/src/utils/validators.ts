import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  rememberMe: yup.boolean()
})

export const registerSchema = yup.object({
  fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
    .required('Username is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['freelancer', 'client']).required('Please select a role')
})

export const forgotPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required')
})

export const resetPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password')
})

export const gigSchema = yup.object({
  title: yup
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  category: yup.string().required('Category is required'),
  description: yup
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description cannot exceed 5000 characters')
    .required('Description is required'),
  tags: yup.array().of(yup.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags')
})

export const profileSchema = yup.object({
  fullName: yup.string().min(2).required('Full name is required'),
  bio: yup.string().max(600, 'Bio cannot exceed 600 characters'),
  tagline: yup.string().max(100, 'Tagline cannot exceed 100 characters'),
  country: yup.string().required('Country is required')
})

export const reviewSchema = yup.object({
  rating: yup.number().min(1).max(5).required('Rating is required'),
  comment: yup
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters')
    .required('Review comment is required')
})

export const portfolioSchema = yup.object({
  projectTitle: yup.string().min(3).max(100).required('Project title is required'),
  description: yup.string().min(20).max(1000).required('Description is required'),
  projectUrl: yup.string().url('Please enter a valid URL').optional(),
  technologies: yup.array().of(yup.string()).min(1, 'At least one technology is required')
})
