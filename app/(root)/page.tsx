import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
};

function HomePage() {
  return (
    <>
      <h1 className="flex-center">Home</h1>
      <Button variant={"default"}>my button</Button>
    </>
  );
}

export default HomePage;
