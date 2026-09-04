"use client";

import { Button } from "@/components/ui/button";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-ring";

export function ContactForm() {
  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // Honeypot: real users can't see this field, so a value means spam.
        if (data.get("website")) return;
        // No backend yet; a valid submission will be wired up later.
      }}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder="What can I help with?"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell me about your project or commission."
          className={`${fieldClass} min-h-32 resize-y`}
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" size="lg" className="self-start">
        Send message
      </Button>
    </form>
  );
}
