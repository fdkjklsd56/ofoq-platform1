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
        email: {
          label: 'البريد الإلكتروني',
          type: 'email',
        },
        password: {
          label: 'كلمة المرور',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            student: true,
            teacher: true,
            admin: true,
          },
        })

        if (!user) {
          throw new Error('البريد الإلكتروني غير مسجل')
        }

        const isValid = await compare(
          credentials.password,
          user.password
        )

        if (!isValid) {
          throw new Error('كلمة المرور غير صحيحة')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          studentId: user.student?.id ?? null,
          teacherId: user.teacher?.id ?? null,
          adminId: user.admin?.id ?? null,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // NextAuth uses token.sub as the main user ID
        token.sub = user.id

        token.role = user.role

        token.studentId =
          user.studentId ?? null

        token.teacherId =
          user.teacherId ?? null

        token.adminId =
          user.adminId ?? null
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        // Use the standard NextAuth JWT subject
        session.user.id = token.sub as string

        session.user.role =
          token.role as string

        session.user.studentId =
          (token.studentId as string | null) ?? null

        session.user.teacherId =
          (token.teacherId as string | null) ?? null

        session.user.adminId =
          (token.adminId as string | null) ?? null
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