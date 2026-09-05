"use client";

import { useState } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-colors placeholder:text-foreground-muted focus-visible:ring-2 focus-visible:ring-ring";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = status === "submitting";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users can't see this field, so a value means spam.
    if (data.get("website")) return;

    setStatus("submitting");
    setErrorMessage("");
    setDialogOpen(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string; errors?: Record<string, string> }
          | null;
        const message =
          body?.error ??
          (body?.errors ? Object.values(body.errors)[0] : undefined) ??
          "Something went wrong. Please try again.";
        throw new Error(message);
      }

      form.reset();
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  return (
    <>
      <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
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

      <Button type="submit" size="lg" className="self-start" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          // Keep the dialog in place while the request is in flight.
          if (isSubmitting) return;
          setDialogOpen(open);
        }}
      >
        <DialogContent
          showCloseButton={!isSubmitting}
          onInteractOutside={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
          onEscapeKeyDown={(event) => {
            if (isSubmitting) event.preventDefault();
          }}
        >
          {isSubmitting ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <LoaderCircle
                className="size-10 animate-spin text-foreground-muted"
                aria-hidden="true"
              />
              <DialogHeader className="items-center text-center">
                <DialogTitle>Sending your message</DialogTitle>
                <DialogDescription>
                  Please wait while we deliver your message.
                </DialogDescription>
              </DialogHeader>
            </div>
          ) : status === "success" ? (
            <>
              <div className="flex flex-col items-center gap-4 text-center">
                <CircleCheck className="size-10 text-primary" aria-hidden="true" />
                <DialogHeader className="items-center text-center">
                  <DialogTitle>Message sent</DialogTitle>
                  <DialogDescription>
                    Thanks for reaching out — I&apos;ll be in touch soon.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4 text-center">
                <CircleX className="size-10 text-destructive" aria-hidden="true" />
                <DialogHeader className="items-center text-center">
                  <DialogTitle>Message not sent</DialogTitle>
                  <DialogDescription>{errorMessage}</DialogDescription>
                </DialogHeader>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
