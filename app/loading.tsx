import loader from "@/assets/loader.gif";
import Image from "next/image";

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Image src={loader} alt="loading..." width={80} height={80} />
    </div>
  );
}

export default Loading;
