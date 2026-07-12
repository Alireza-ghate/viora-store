import { prisma } from "@/db/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compareSync } from "bcrypt-ts-edge";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      // credentials comes from form inputs
      async authorize(credentials) {
        //  1) check if there is any email or password entered by user in form (credentials is exist or not)
        if (credentials === null) return null;
        // 2) if there is any credentials go find user in database
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        // 3) check if user exists and password matches
        if (user && user.password) {
          // compareSync: compares plain password with hash password
          const isMatch = compareSync(
            credentials.password as string, // plain text of password entered by user in form
            user.password, // hash version of password in database
          );
          // 4) if password is correct or matched returns user obj
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              role: user.role,
              email: user.email,
            };
          }
        }
        // if user does not exist or passwords does not match return null
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token, user, trigger }: any) {
      // set the user ID from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      console.log(token);

      // if there is an update
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },

    async jwt({ token, user, session, trigger }) {
      // assign user fields to token (like role property in user to token obj)
      // first check user exists
      if (user) {
        token.role = user.role;

        // if user has no name , use first part of email as name
        if (user.name === "No_NAME")
          token.name = user.email!.split("@")[0].slice(0, 1).toUpperCase();

        // update database to reflect token name

        await prisma.user.update({
          where: { id: user.id },
          data: { name: token.name! },
        });
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);
