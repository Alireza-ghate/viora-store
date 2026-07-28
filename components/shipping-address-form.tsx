"use client";

import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Spinner from "./shared/spinner";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { updateUserAddress } from "@/lib/actions/user-actions";

interface ShippingAddressFormProps {
  address: ShippingAddress;
}
function ShippingAddressForm({ address }: ShippingAddressFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues, // after deploy set all fileds to ""
    mode: "onChange",
  });

  // whenever form is submitted, user.address field will be update with valuses from this from
  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    data,
  ) => {
    startTransition(async () => {
      // Do something with the form values.
      const res = await updateUserAddress(data);
      if (res.seccess) {
        toast.success(res.message);
      } else if (!res.success) {
        toast.error(res.message);
      }

      router.push("/payment-method");
    });
  };
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter an address to ship to
        </p>

        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col md:flex-row"></div>
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter full name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="streetAddress"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Street Address</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter street address"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>City</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter city"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Postal code</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter postal code"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="country"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Enter country"
                  type="text"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex gap-2">
            <Button
              className="w-full"
              disabled={isPending}
              size={"lg"}
              type="submit"
            >
              {isPending ? <Spinner /> : <ArrowRight className="w-4 h-4" />}{" "}
              Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ShippingAddressForm;
