"use client";

import { signInDefaultValues } from "@/lib/constants";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Link from "next/link";
import { useActionState } from "react";
import { signInWithCredentialsAction } from "@/lib/actions/user-actions";
import { useFormStatus } from "react-dom";
import Spinner from "./shared/spinner";
import { useSearchParams } from "next/navigation";

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant={"default"} disabled={pending} className="w-full">
      {pending ? "Signing in" : "Sign in"}
      {pending && <Spinner size={24} />}
    </Button>
  );
}

function CredentialsSignInForm() {
  // data that we destructure here is the same server action state that we returned from our server action
  const [data, action] = useActionState(signInWithCredentialsAction, {
    success: false,
    message: "",
  }); // for manage server action's state

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            required
            placeholder="Password"
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div>
          <SignInButton />
        </div>
        {/* render error message if form didnt submitted correctly */}
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-blue-400 underline"
            target="_self"
            href={"/sign-up"}
          >
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}

export default CredentialsSignInForm;
