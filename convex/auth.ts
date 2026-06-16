import { convexAuth } from "@convex-dev/auth/server";
import Github from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Github,
    Google,
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string, 
        };
      },
    }),
  ],
});