import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/query";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/writeclient";
import { debug } from "console";

// Define GitHub-specific profile type
type GitHubProfile = {
  id: string | number;
  login: string;
  bio?: string;
};

const authConfig: NextAuthConfig = {
  providers: [
   GitHub({
  clientId: process.env.AUTH_GITHUB_ID!,
  clientSecret: process.env.AUTH_GITHUB_SECRET!,
}),
  ],
  debug:true,
  callbacks: {
    // 1️⃣ Sign-in callback — create author if new
    async signIn({ user, profile }) {
  try {
    if (!profile) throw new Error("No profile returned from GitHub");

    const ghProfile = profile as GitHubProfile;
    const id = String(ghProfile.id); // always store as string
    const login = ghProfile.login;
    const bio = ghProfile.bio || "";

    if (!id) throw new Error("GitHub ID missing");

    const existingUser = await client
      .withConfig({ useCdn: false })
      .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

    if (!existingUser) {
      await writeClient.create({
        _type: "author",
        id,
        name: user.name,
        username: login,
        email: user.email,
        image: user.image,
        bio,
      });
    }

    return true; // allow login
  } catch (err) {
    console.error("[signIn] Error:", err);
    return false; // AccessDenied
  }
},

    // 2️⃣ JWT callback — attach author _id to token
    async jwt({ token, account, profile }) {
  if (account && profile) {
    const ghProfile = profile as GitHubProfile;
    const user = await client
      .withConfig({ useCdn: false })
      .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: String(ghProfile.id) });
    token.id = user?._id;
  }
  return token;
},

    // 3️⃣ Session callback — attach token.id to session
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
