"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// sign in user with credentials
export async function signInWithCredentialsAction(
  prevState: unknown,
  formData: FormData,
) {
  try {
    // get user based on its email and password and validate at same time
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      // userName: formData.get("userName"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" }; // its an action state
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" }; // its an action state
  }
}

// Sign out the user
export async function signOutUserAction() {
  await signOut();
}
