import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function Menu() {
  return (
    <div className="flex justify-end gap-x-3">
      {/* menu in desktop */}
      <nav className="hidden md:flex w-full max-w-xs gap-x-1">
        <ModeToggle />
        <Button asChild variant={"ghost"}>
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon /> Sign in
          </Link>
        </Button>
      </nav>

      {/* menu in mobile(sheet component) */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger asChild className="align-middle">
            <Button variant={"outline"}>
              <EllipsisVertical />
            </Button>
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start">
            <SheetHeader className="gap-y-3 items-start">
              <SheetTitle>Menu</SheetTitle>
              <ModeToggle />
              <Button asChild variant={"ghost"}>
                <Link href="/cart">
                  <ShoppingCart /> Cart
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sign-in">
                  <UserIcon /> Sign in
                </Link>
              </Button>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default Menu;
