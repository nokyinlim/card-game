import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { KyselyAdapter } from "@auth/kysely-adapter";
import Google from "next-auth/providers/google";
import { db } from "./lib/db/db";


const config = {
    providers: [
        Google
    ],
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    // @ts-ignore
    adapter: KyselyAdapter(db),
    ...config,
    basePath: "/api/auth",
    pages: {
        signIn: "/login",
    },
})