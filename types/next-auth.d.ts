import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string
      studentId?: string
      teacherId?: string
      adminId?: string
    } & DefaultSession['user']
  }

  interface User {
    role?: string
    studentId?: string
    teacherId?: string
    adminId?: string
  }
}