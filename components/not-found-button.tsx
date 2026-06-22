"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

function NotFoundButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/")}
      variant={"outline"}
      className="mt-4 ml-2"
    >
      Back To Home
    </Button>
  );
}

export default NotFoundButton;
