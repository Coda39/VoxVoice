import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import Button
import { AudioWaveformIcon as WaveformCircle } from "lucide-react"; // Import icon

// Reusable Header Component (Consider moving to components/layout/header.tsx)
const AppHeader = () => (
  <header className="border-b border-[#bfd7ed] bg-white">
    <div className="container flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2">
        <WaveformCircle className="h-8 w-8 text-[#0f4c75]" />
        <span className=" text-xl font-bold tracking-tight text-[#0f4c75]">
          VOX VOICE
        </span>
      </Link>
      {/* Keep nav simple or remove for auth pages */}
      <nav className="hidden md:flex gap-6">
        <Link
          href="/#process" // Link back to landing page sections
          className="text-sm font-medium text-[#3282b8] hover:text-[#0f4c75] transition-colors"
        >
          Process
        </Link>
        <Link
          href="/#privacy"
          className="text-sm font-medium text-[#3282b8] hover:text-[#0f4c75] transition-colors"
        >
          Privacy
        </Link>
      </nav>
      {/* Conditional Auth Buttons could go here if needed, or keep simple */}
      <Button asChild variant="outline" size="sm">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    </div>
  </header>
);

// Reusable Footer Component (Consider moving to components/layout/footer.tsx)
const AppFooter = () => (
  <footer className="border-t border-[#bfd7ed] bg-[#f8fafc] py-6">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <WaveformCircle className="h-6 w-6 text-[#0f4c75]" />
          <span className=" text-sm font-bold text-[#0f4c75]">
            VOX VOICE RESEARCH
          </span>
        </div>
        <div className="text-sm text-[#3282b8]">
          © {new Date().getFullYear()} Vox Research. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link
            href="#" // Update with actual links later
            className="text-sm text-[#3282b8] hover:text-[#0f4c75]"
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-sm text-[#3282b8] hover:text-[#0f4c75]"
          >
            Terms
          </Link>
          <Link
            href="#"
            className="text-sm text-[#3282b8] hover:text-[#0f4c75]"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  // Message display remains the same if needed after submission/redirect
  if (
    "message" in searchParams ||
    "success" in searchParams ||
    "error" in searchParams
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 bg-white border border-[#bfd7ed] rounded-lg shadow-md flex flex-col items-center gap-4">
            <FormMessage message={searchParams} />
            <Button asChild variant="link">
              <Link href="/sign-in">Go to Sign In</Link>
            </Button>
          </div>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        {/* Centered Card for the Form */}
        <div className="w-full max-w-md p-8 bg-white border border-[#bfd7ed] rounded-lg shadow-md">
          <form className="flex flex-col gap-4">
            {" "}
            {/* Use gap for spacing */}
            <div className="text-center mb-4">
              {" "}
              {/* Center heading */}
              <h1 className="text-2xl font-bold text-[#0f4c75] ">
                Sign up
              </h1>{" "}
              {/* Use theme colors/font */}
              <p className="text-sm text-[#3282b8]">
                Already have an account?{" "}
                <Link
                  className="text-[#0f4c75] font-medium underline hover:text-[#1a6ea8]"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>
            {/* Form Fields */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-[#0f4c75]">
                Email
              </Label>
              <Input
                name="email"
                placeholder="you@example.com"
                required
                className="border-[#bfd7ed] focus:border-[#3282b8] focus:ring-[#3282b8]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-[#0f4c75]">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password (min. 6 characters)"
                minLength={6}
                required
                className="border-[#bfd7ed] focus:border-[#3282b8] focus:ring-[#3282b8]"
              />
            </div>
            {/* Submit Button */}
            <SubmitButton
              formAction={signUpAction}
              pendingText="Signing up..."
              className="w-full bg-[#0f4c75] hover:bg-[#1a6ea8] text-white mt-4" // Use theme colors
            >
              Sign up
            </SubmitButton>
            {/* Display potential errors from previous attempts (if not handled by the message block above) */}
            {"error" in searchParams &&
              !("message" in searchParams || "success" in searchParams) && (
                <div className="mt-4 text-center">
                  <FormMessage message={searchParams} />
                </div>
              )}
          </form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
