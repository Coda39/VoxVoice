import Link from "next/link";
import { Mic, AudioWaveformIcon as WaveformCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server"; // Import server client

// Make the component async
export default async function Home() {
  // Fetch user session on the server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Determine the correct link based on auth status
  const contributeLink = user ? "/protected/record" : "/sign-in";

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <header className="border-b border-[#bfd7ed] bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <WaveformCircle className="h-8 w-8 text-[#0f4c75]" />
            <span className="text-xl font-bold tracking-tight text-[#0f4c75]">
              VOX VOICE
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#process"
              className="text-sm font-medium text-[#3282b8] hover:text-[#0f4c75] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#privacy"
              className="text-sm font-medium text-[#3282b8] hover:text-[#0f4c75] transition-colors"
            >
              Privacy
            </Link>
          </nav>
          <Button
            asChild
            className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white"
          >
            <Link href={contributeLink}>
              {user ? "Record Now" : "Sign In to Record"}
            </Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#bfd7ed] to-[#f8fafc]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-[#3282b8] bg-[#bbe1fa]/20 px-3 py-1 text-sm text-[#0f4c75]">
                  Machine Learning Class Project
                </div>
                <h1 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[#0f4c75]">
                  LEND YOUR VOICE TO OUR CLASS PROJECT!
                </h1>
                <p className="text-[#3282b8] md:text-xl">
                  Help our student team gather data! We're building a fun ML
                  model to classify voices as male or female, and we need your
                  recordings to train it.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white h-12 px-6 rounded-md"
                  >
                    <Link href={contributeLink}>
                      <Mic className="mr-2 h-5 w-5" /> Record Your Voice
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] overflow-hidden border-4 border-white shadow-xl">
                {/* Image remains the same, context is adjusted by text */}
                <div className="absolute inset-0 bg-[#0f4c75]/10 z-10">
                  <Image
                    src="/shouting_woman.png"
                    alt="speaking woman logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="py-12 md:py-24 bg-[#f8fafc]">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="space-y-4">
                  <h2 className=" text-2xl md:text-3xl font-bold text-[#0f4c75]">
                    HOW IT WORKS (IT'S QUICK & EASY!)
                  </h2>
                  <p className="text-[#3282b8] md:text-lg">
                    Contributing takes just a few minutes. Here’s the simple
                    process:
                  </p>

                  <div className="space-y-6 mt-6">
                    {/* Process steps adjusted slightly */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0f4c75] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h3 className=" text-lg font-bold text-[#0f4c75]">
                          READ A PROMPT
                        </h3>
                        <p className="text-[#3282b8]">
                          We'll give a short, simple text prompt to read aloud.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0f4c75] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div>
                        <h3 className=" text-lg font-bold text-[#0f4c75]">
                          RECORD YOUR VOICE
                        </h3>
                        <p className="text-[#3282b8]">
                          Use your device's microphone to make the recordings.
                          Clear audio helps!
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0f4c75] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h3 className=" text-lg font-bold text-[#0f4c75]">
                          SUBMIT FOR THE PROJECT
                        </h3>
                        <p className="text-[#3282b8]">
                          Review your clips and submit them to help our
                          project's dataset.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white mt-6"
                  >
                    <Link href={contributeLink}>Start Recording Now</Link>
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative aspect-video md:aspect-square  overflow-hidden border-4 border-white shadow-xl">
                {/* Image remains the same */}
                <div className="absolute inset-0 bg-[#0f4c75]/10 z-10">
                  <Image
                    src="/diagram2.png"
                    alt="Process diagram illustration"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section adjusted for project context */}
        <section
          id="privacy"
          className="py-12 md:py-24 bg-[#0f4c75] text-white"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto mb-4 text-[#bbe1fa]" />
              <h2 className=" text-2xl md:text-3xl font-bold">
                YOUR PRIVACY MATTERS
              </h2>
              <p className="text-[#bbe1fa] md:text-lg">
                We take data handling seriously, even for a class project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-[#1a6ea8] p-6 rounded-lg">
                <h3 className=" text-xl font-bold mb-2">PROJECT USE ONLY</h3>
                <p className="text-[#bbe1fa]">
                  Your voice recordings will *only* be used for this specific
                  machine learning class project to train our male/female voice
                  classifier. They won't be sold, shared publicly, or used for
                  any other purpose.
                  {/* Optional: Add if applicable */}
                  {/* We plan to delete all collected data after the project is graded. */}
                </p>
              </div>

              <div className="bg-[#1a6ea8] p-6 rounded-lg">
                <h3 className=" text-xl font-bold mb-2">ANONYMIZATION</h3>
                <p className="text-[#bbe1fa]">
                  While you sign in to contribute, your user identity is kept
                  separate from the voice data used for training. The audio
                  files used by the model are anonymized.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <h2 className=" text-2xl md:text-3xl font-bold text-[#0f4c75]">
                HELP OUR PROJECT SUCCEED!
              </h2>
              <p className="text-[#3282b8] md:text-xl">
                Your voice recording is a valuable piece of data for our student
                project! Just a few minutes of your time makes a big difference
                in helping us learn ML and build our voice classifier.
              </p>
              <Button
                asChild
                className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white h-14 px-8 text-lg rounded-md mx-auto"
              >
                <Link href={contributeLink}>
                  <Mic className="mr-2 h-5 w-5" /> Record Your Voice
                </Link>
              </Button>
              <p className="text-sm text-[#3282b8]">
                By participating, you agree to our simple project{" "}
                <Link href="#" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Notes
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer adjusted slightly */}
      <footer className="border-t border-[#bfd7ed] bg-[#f8fafc] py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <WaveformCircle className="h-6 w-6 text-[#0f4c75]" />
              <span className="text-sm font-bold text-[#0f4c75]">
                VOX VOICE
              </span>
            </div>
            <div className="text-sm text-[#3282b8]">
              © {new Date().getFullYear()} Vox Voice.
            </div>
            <div className="flex gap-4">
              <Link
                href="#"
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
              {/* Keep Contact if you have one, otherwise remove */}
              {/* <Link href="#" className="text-sm text-[#3282b8] hover:text-[#0f4c75]">Contact</Link> */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
