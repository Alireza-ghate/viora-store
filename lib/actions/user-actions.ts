"use server";

import { auth, signIn, signOut } from "@/auth";
import {
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from "../validators";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";

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

// sign up user with credentials
export async function signUpUserWithCredentialsAction(
  prevState: unknown,
  formData: FormData,
) {
  try {
    //  get user obj from form and validate at same time
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainTextPassword = user.password;
    // before send user obj to the database, hash password
    user.password = hashSync(user.password, 10);

    // check user with email exists or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    // add user obj we got from form to database with prisma
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // // check userName already exists or not
    // const existingUsername = await prisma.user.findUnique({
    //   where: {
    //     name: user.name,
    //   },
    // });

    // after user signed up(created), sign that in
    // for sign in we need plan text password not hash version
    await signIn("credentials", {
      email: user.email,
      password: plainTextPassword,
    });

    return { success: true, message: "User registered successfully" }; // server action state
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// get user by its ID
export async function getUserByID(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("user not found");

  return user;
}

//  Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    // get current logged in user
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");
    // validate input data with schema
    const address = shippingAddressSchema.parse(data);
    // update user's address in database
    await prisma.user.update({
      where: { id: currentUser.id }, // only the current logged in user's address want to be update
      data: { address: address }, // only update address property of user obj
    });

    return { seccess: true, message: "Informations successfully recieved" };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
