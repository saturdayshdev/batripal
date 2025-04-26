import Image from "next/image";
import { SurgeryForm } from "@/components/surgery-form";

export default function Home() {
  return (
    <>
      <div className="h-full hidden sm:flex flex-col gap-8 items-center justify-center my-4">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={74}
          height={74}
          className="rounded-md"
        />
        <Image src={"/logo.svg"} alt="logo" width={74} height={74} />
        <p className="mb-2 text-center">Check our demo on mobile:</p>
        <Image
          src="/qr-code.svg"
          alt="QR code to open demo on mobile"
          width={128}
          height={128}
        />
      </div>

      <main className="flex flex-1 flex-col gap-4 sm:hidden ">
        <header className="w-full h-24 border-b border-gray-200 overflow-hidden flex items-center justify-center ">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={74}
            height={74}
            className="rounded-md"
          />
        </header>
        <section className="sm:hidden">
          <div className="py-4">
            <h2 className="text-2xl font-bold mb-2 text-center">
              Hi, I&apos;m Batripal
            </h2>
            <p className="text-gray-600 text-center">
              Your personal post-bariatric surgery AI companion
            </p>
          </div>
          <SurgeryForm />
        </section>
      </main>
    </>
  );
}
