import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
};
// DELETE LATER
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

function HomePage() {
  // await delay(2000);
  return (
    <>
      <h1 className="flex-center">Home</h1>
      <Button variant={"default"}>my button</Button>
    </>
  );
}

export default HomePage;
