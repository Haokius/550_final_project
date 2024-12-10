import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;
      
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          console.error('NEXT_PUBLIC_API_URL is not defined');
          return false;
        }

        const email = user.email || `${account.providerAccountId}@${account.provider}.user`;
        const name = user.name || 'User';

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            name: name,
            provider: account.provider
          }),
        });
        
        if (!response.ok) {
          console.error('Backend sync failed with status:', response.status);
          return false;
        }
        
        return true;
      } catch (error) {
        console.error('Backend sync failed:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.provider = token.provider;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }