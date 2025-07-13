import type { auth } from "@/lib//auth/auth";
import { ac, roles } from "@/lib/permissions";
import {
  adminClient,
  customSessionClient,
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({ ac, roles }),
    customSessionClient<typeof auth>(),
    magicLinkClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  admin,
  sendVerificationEmail,
  forgetPassword,
  resetPassword,
  updateUser,
} = authClient;
