import { APP_NAME } from "@/lib/constants";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t w-full">
      <div className="flex-center p-5">
        {currentYear} {APP_NAME} .All rights reserved
      </div>
    </footer>
  );
}

export default Footer;
