import NextAuth from "next-auth";
import { authOptions } from "@/app/authoptions";


const handler = NextAuth(authOptions);

// The default export is required for Next.js API route
export { handler as GET, handler as POST };