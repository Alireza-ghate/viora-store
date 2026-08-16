"use client";

import { updateUserPaymentMethodAction } from "@/lib/actions/user-actions";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { paymentMethodSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Spinner from "./shared/spinner";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface PaymentMethodFormProps {
  preferredPaymentMethod: string | null;
}

function PaymentMethodForm({ preferredPaymentMethod }: PaymentMethodFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  async function onSubmit(data: z.infer<typeof paymentMethodSchema>) {
    const res = await updateUserPaymentMethodAction(data);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    router.push("/place-order");
  }

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select a payment method
        </p>

        <form
          method="post"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* <div className="flex flex-col md:flex-row"></div> */}
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-col space-y-2"
                defaultValue={DEFAULT_PAYMENT_METHOD}
              >
                {PAYMENT_METHODS.map((paymentOpt) => (
                  <Field key={paymentOpt} orientation="horizontal">
                    <RadioGroupItem
                      checked={field.value === paymentOpt}
                      value={paymentOpt}
                      id={paymentOpt}
                      disabled={form.formState.isSubmitting}
                    />
                    <FieldLabel htmlFor={paymentOpt} className="font-normal">
                      {paymentOpt}
                    </FieldLabel>
                  </Field>
                ))}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </RadioGroup>
            )}
          />

          <div className="flex gap-2">
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting}
              size={"lg"}
              type="submit"
            >
              {form.formState.isSubmitting ? (
                <Spinner />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}{" "}
              Continue
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default PaymentMethodForm;
