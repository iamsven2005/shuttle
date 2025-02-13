"use client";

import { SignInMethodDivider } from "@/components/SignInMethodDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="flex min-h-screen w-full container my-auto mx-auto">
      <div className="max-w-[384px] mx-auto flex flex-col my-auto gap-4 pb-8">
        {step === "signIn" ? (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Sign in or create an account
            </h2>
            <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          </>
        ) : (
          <>
            <h2 className="font-semibold text-2xl tracking-tight">
              Check your email
            </h2>
            <p>A sign-in link has been sent to your email address.</p>
            <Button
              className="p-0 self-start"
              variant="link"
              onClick={() => setStep("signIn")}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function SignInWithMagicLink({
  handleLinkSent,
}: {
  handleLinkSent: () => void;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("redirectTo", "/product");
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
            toast({
              title: "Could not send sign-in link",
              variant: "destructive",
            });
          });
      }}
    >
      <label htmlFor="email">Email</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <Button type="submit">Send sign-in link</Button>
      <Toaster />
    </form>
  );
}
