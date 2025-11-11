import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from './mongodb';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if credentials match admin credentials
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: 'admin-1',
            email: credentials.email,
            name: 'Admin',
            isAdmin: true,
            organization: 'System',
          };
        }

        // Check database for regular users
        try {
          const client = await clientPromise;
          const db = client.db('quizdb');
          const user = await db.collection('users').findOne({ email: credentials.email });

          if (!user || !user.password) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            organization: user.organization,
            isAdmin: false,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const client = await clientPromise;
          const db = client.db('quizdb');

          const existingUser = await db.collection('users').findOne({ email: user.email });

          if (!existingUser) {
            // Create new user from Google
            await db.collection('users').insertOne({
              email: user.email,
              name: user.name || '',
              googleId: account.providerAccountId,
              image: user.image,
              organization: '', // Will be set during onboarding
              college: '',
              clubName: '',
              role: 'user',
              createdAt: new Date(),
            });
          } else if (!existingUser.name && user.name) {
            // Update name if it wasn't set before
            await db.collection('users').updateOne(
              { email: user.email },
              { $set: { name: user.name } }
            );
          }
        } catch (error) {
          console.error('Error creating user:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.organization = (token.organization as string) || '';
        session.user.isAdmin = token.email === process.env.ADMIN_EMAIL;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.organization = user.organization;
      }

      // Fetch latest user data from database
      if (token.email && token.email !== process.env.ADMIN_EMAIL) {
        try {
          const client = await clientPromise;
          const db = client.db('quizdb');
          const dbUser = await db.collection('users').findOne({ email: token.email });
          if (dbUser) {
            token.organization = dbUser.organization;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }

      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
