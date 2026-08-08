"use client";

import { updateProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions/user-actions";
import Spinner from "./shared/spinner";

function ProfileForm() {
  const { data: session, update } = useSession(); // in order to use this we have to wrapp the client component in SessionProvider

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof updateProfileSchema>) {
    // first call the server action
    const res = await updateUserProfile(data);
    if (!res.success) {
      toast.error(res.message);
    }

    // then update the session
    const newSession = {
      ...session,
      user: {
        ...session?.user, // other field will remain
        name: data.name, // only update name field
      },
    };

    await update(newSession);

    toast.success(res.message);
  }
  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <Input
              className="cursor-not-allowed"
              type="email"
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="email"
              disabled
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <Input
              type="text"
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={false}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="w-full h-10"
        type="submit"
        size="lg"
        disabled={form.formState.isSubmitting}
      >
        Update Profile {form.formState.isSubmitting && <Spinner />}
      </Button>
    </form>
  );
}

export default ProfileForm;
