"use client";

import { createOrderAction } from "@/lib/actions/order-action";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import Spinner from "./shared/spinner";
import { Button } from "./ui/button";

function PlaceOrderForm() {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  async function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    startTransition(async () => {
      const res = await createOrderAction();

      if (res.redirectTo) {
        router.push(res.redirectTo);
      }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Button disabled={isPending} className="w-full">
        {isPending ? <Spinner /> : <Check />} Place Order
      </Button>
    </form>
  );
}

export default PlaceOrderForm;
