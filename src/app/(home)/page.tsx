import { Button } from "~/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MUTATIONS } from "@/src/server/db/queries";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-[100vw] flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            M1 Drive
          </h1>
          <p className="text-lg text-zinc-400">
            Secure, fast, and easy file storage for the modern web
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            const session = await auth();

            if (!session.userId) {
              return redirect("/sign-in");
            }

            const rootFolderId = await MUTATIONS.onboardUser(session.userId);

            return redirect(`/f/${rootFolderId}`);
          }}
        >
          <SignInButton forceRedirectUrl={"/drive"}>
            <Button
              className="w-full bg-white text-black hover:bg-zinc-200"
              size="lg"
            >
              Get Started
            </Button>
          </SignInButton>
        </form>
      </div>
      <div className="absolute bottom-8 text-sm text-zinc-500">
        © {new Date().getFullYear()} M1 Drive. All rights reserved.
      </div>
    </div>
  );
}
