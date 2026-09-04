import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Designed By Been.",
};

export default function ContactPage() {
  return (
    <div className="grid grid-cols-1 md:min-h-[calc(100svh-4rem)] md:grid-cols-2">
      <div className="relative min-h-72 w-full md:min-h-full">
        <Image
          src="/the_been.jpg"
          alt="Designed By Been"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-12">
        <div className="mx-auto w-full max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Contact
          </h1>
          <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">
            Get in touch about projects, commissions, or collaborations.
          </p>

          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
