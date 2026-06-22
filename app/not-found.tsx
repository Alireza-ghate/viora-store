import NotFoundButton from "@/components/not-found-button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";

export const metadata = {
  title: "Not Found",
};

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-y-4">
      <Image
        src="/images/logo.svg"
        alt={`${APP_NAME} logo`}
        width={48}
        height={48}
        priority
      />
      <div className="shadow-md p-6 rounded-lg w-1/3 text-center">
        <h1 className="text-3xl font-bold mb-4">404 Not Found</h1>
        <p className="text-destructive">Could not found requested page</p>
        <NotFoundButton />
      </div>
    </div>
  );
}

export default NotFoundPage;
