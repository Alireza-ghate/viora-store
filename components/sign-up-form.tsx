"use client";

import { signUpUserWithCredentialsAction } from "@/lib/actions/user-actions";
import Link from "next/link";
import { useActionState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signUpDefaultValues } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";
import Spinner from "./shared/spinner";

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant={"default"} disabled={pending} className="w-full">
      {pending ? "Registering..." : "Sign up"}
      {pending && <Spinner size={24} />}
    </Button>
  );
}

function SignUpForm() {
  const [state, action] = useActionState(signUpUserWithCredentialsAction, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            // required
            placeholder="Name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            // required
            placeholder="Email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            // required
            placeholder="Password"
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            // required
            placeholder="ConfirmPassword"
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <SignUpButton />
        </div>
        {/* render error message if form didnt submitted correctly */}
        {state && !state.success && (
          <div className="text-center text-destructive">{state.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-blue-400 underline"
            target="_self"
            href={"/sign-in"}
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
}

export default SignUpForm;
