import MainNav from "@/components/main-nav";
import Menu from "@/components/shared/header/menu";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col">
        <div className="container mx-auto border-b">
          <div className="flex items-center h-16 px-4">
            <Link href="/">
              <Image
                src="/images/logo.svg"
                alt={`${APP_NAME} logo`}
                width={48}
                height={48}
              />
            </Link>

            {/* Main nav */}
            <MainNav className="mx-6" />

            <div className="flex items-center ml-auto">
              <Menu />
            </div>
          </div>
        </div>

        <div className="flex-1 container mx-auto p-8 pt-6 space-y-4">
          {children}
        </div>
      </div>
    </>
  );
}
