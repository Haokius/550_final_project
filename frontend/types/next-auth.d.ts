import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      provider?: string
    } & DefaultSession['user']
  }

  interface JWT {
    provider?: string
  }
} 