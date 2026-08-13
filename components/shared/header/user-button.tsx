import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutUserAction } from "@/lib/actions/user-actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

async function UserButton() {
  const session = await auth();

  const firstLetterUsername =
    session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  if (session)
    return (
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center">
              <Button
                variant={"ghost"}
                className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
              >
                {firstLetterUsername}
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-y-2 mb-2">
                <div className="text-sm leading-none font-medium">
                  {session?.user?.name}
                </div>
                <div className="text-sm leading-none text-muted-foreground">
                  {session?.user?.email}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <Link className="w-full" href="/user/profile">
                User Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link className="w-full" href="/user/orders">
                Order History
              </Link>
            </DropdownMenuItem>

            {session?.user?.role === "admin" && (
              <DropdownMenuItem>
                <Link className="w-full" href="/admin/overview">
                  Admin
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="p-0 mb-1">
              <form action={signOutUserAction} className="w-full">
                <Button
                  className="w-full px-2 py-4 h-4 justify-start"
                  variant={"ghost"}
                >
                  Sign Out
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

  return (
    <Button asChild variant={"default"}>
      <Link href="/sign-in">
        <UserIcon />
        Sign In
      </Link>
    </Button>
  );
}

export default UserButton;
