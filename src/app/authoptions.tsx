import  { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Session {
    user: {
      id: string; 
      email: string;
      name?: string | null;
      profilePicture?: string | null;
    };
    expires: string; 
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Authentication provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
    }),

  ],
  session: {
    strategy: "jwt", 
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Google OAuth Sign-in
      if (account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findUnique({
            where: { email: token.email || undefined }
          });

          if (existingUser) {
            // Update user if needed
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: token.name || existingUser.name,
                profilePicture: token.picture || existingUser.profilePicture
              }
            });

            // Set token properties
            token.id = existingUser.id.toString();
            token.name = existingUser.name;
            token.picture = existingUser.profilePicture;
          } else {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                name: token.name || '',
                email: token.email || '',
                profilePicture: token.picture || null
              }
            });

            // Set token properties
            token.id = newUser.id.toString();
            token.name = newUser.name;
            token.picture = newUser.profilePicture;
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }
      }

      // Add additional token properties
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | undefined;
        session.user.profilePicture = token.picture as string | undefined;
      }
      return session;
    },
  },
};