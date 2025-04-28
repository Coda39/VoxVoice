// app/protected/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { signOutAction } from "@/app/actions"; // <-- Import the sign out action

export default async function ProtectedRedirectPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#0f4c75]">Welcome!</h1>
        <p className="text-muted-foreground">
          You are successfully signed in as {user.email}.{" "}
          {/* Optional: Show email */}
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg">Ready to contribute your voice?</p>
        <Button
          asChild
          size="lg"
          className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white"
        >
          <Link href="/protected/record">
            <Mic className="mr-2 h-5 w-5" />
            Start Recording
          </Link>
        </Button>
      </div>

      {/* --- Add Logout Button --- */}
      <div className="mt-6">
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
      {/* --- End Logout Button --- */}
    </div>
  );
}
