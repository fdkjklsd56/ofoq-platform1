import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db/prisma'
import { compare } from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'البريد الإلكتروني', type: 'email' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            student: true,
            teacher: true,
            admin: true,
          },
        })

        if (!user) {
          throw new Error('البريد الإلكتروني غير مسجل')
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error('كلمة المرور غير صحيحة')
        }

        if (!user.emailVerified) {
          throw new Error('يرجى التحقق من بريدك الإلكتروني أولاً')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          studentId: user.student?.id,
          teacherId: user.teacher?.id,
          adminId: user.admin?.id,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.studentId = user.studentId
        token.teacherId = user.teacherId
        token.adminId = user.adminId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.studentId = token.studentId as string
        session.user.teacherId = token.teacherId as string
        session.user.adminId = token.adminId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}