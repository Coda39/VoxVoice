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
              Process
            </Link>
            <Link
              href="#privacy"
              className="text-sm font-medium text-[#3282b8] hover:text-[#0f4c75] transition-colors"
            >
              Privacy
            </Link>
          </nav>
          {/* --- Updated Button --- */}
          <Button
            asChild
            className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white"
          >
            <Link href={contributeLink}>Contribute Now</Link>
          </Button>
          {/* --- End Updated Button --- */}
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#bfd7ed] to-[#f8fafc]">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-[#3282b8] bg-[#bbe1fa]/20 px-3 py-1 text-sm text-[#0f4c75]">
                  Vox Research Initiative
                </div>
                <h1 className=" text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-[#0f4c75]">
                  CONTRIBUTE YOUR VOICE TO THE FUTURE OF AI
                </h1>
                <p className="text-[#3282b8] md:text-xl">
                  Help by contributing your voice recordings to my research
                  project. Aiming to learn to classify between male and female
                  voices.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* --- Updated Button --- */}
                  <Button
                    asChild
                    className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white h-12 px-6 rounded-md"
                  >
                    <Link href={contributeLink}>
                      <Mic className="mr-2 h-5 w-5" /> Record Your Voice
                    </Link>
                  </Button>
                  {/* --- End Updated Button --- */}
                </div>
              </div>
              <div className="relative aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] overflow-hidden border-4 border-white shadow-xl">
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
                    HOW THE RECORDING PROCESS WORKS
                  </h2>
                  <p className="text-[#3282b8] md:text-lg">
                    Contributing your voice is simple, secure, and takes just a
                    few minutes of your time.
                  </p>

                  <div className="space-y-6 mt-6">
                    {/* Process steps remain the same */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0f4c75] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div>
                        <h3 className=" text-lg font-bold text-[#0f4c75]">
                          READ SAMPLE TEXTS
                        </h3>
                        <p className="text-[#3282b8]">
                          You'll be presented with various texts to read aloud
                          and record.
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
                          Use your device's microphone to record clear audio
                          samples.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#0f4c75] flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div>
                        <h3 className=" text-lg font-bold text-[#0f4c75]">
                          SUBMIT & CONTRIBUTE
                        </h3>
                        <p className="text-[#3282b8]">
                          Review your recordings and submit them to our research
                          database.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* --- Updated Button --- */}
                  <Button
                    asChild
                    className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white mt-6"
                  >
                    <Link href={contributeLink}>Start Recording Now</Link>
                  </Button>
                  {/* --- End Updated Button --- */}
                </div>
              </div>

              <div className="order-1 lg:order-2 relative aspect-video md:aspect-square  overflow-hidden border-4 border-white shadow-xl">
                <div className="absolute inset-0 bg-[#0f4c75]/10 z-10">
                  <Image
                    src="/diagram2.png"
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

        {/* Privacy Section remains the same */}
        <section
          id="privacy"
          className="py-12 md:py-24 bg-[#0f4c75] text-white"
        >
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center space-y-4">
              <Shield className="h-12 w-12 mx-auto mb-4 text-[#bbe1fa]" />
              <h2 className=" text-2xl md:text-3xl font-bold">
                YOUR DATA PRIVACY IS OUR PRIORITY
              </h2>
              <p className="text-[#bbe1fa] md:text-lg">
                We're committed to protecting your privacy and using your voice
                data responsibly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-[#1a6ea8] p-6 rounded-lg">
                <h3 className=" text-xl font-bold mb-2">DATA USAGE</h3>
                <p className="text-[#bbe1fa]">
                  Your voice recordings will only be used for research purposes
                  to improve machine learning models. We'll never sell your data
                  to third parties or use it for purposes outside of our
                  research scope.
                </p>
              </div>

              <div className="bg-[#1a6ea8] p-6 rounded-lg">
                <h3 className=" text-xl font-bold mb-2">ANONYMIZATION</h3>
                <p className="text-[#bbe1fa]">
                  All voice data is anonymized before being added to our
                  research database. Your personal information is kept separate
                  from your voice recordings to protect your identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-8">
              <h2 className=" text-2xl md:text-3xl font-bold text-[#0f4c75]">
                JOIN THOUSANDS OF CONTRIBUTORS SHAPING THE FUTURE OF VOICE AI
              </h2>
              <p className="text-[#3282b8] md:text-xl">
                Your voice matters. By contributing just a few minutes of your
                time, you'll help create more natural, responsive, and accurate
                voice technologies.
              </p>
              {/* --- Updated Button --- */}
              <Button
                asChild
                className="bg-[#0f4c75] hover:bg-[#1a6ea8] text-white h-14 px-8 text-lg rounded-md mx-auto"
              >
                <Link href={contributeLink}>
                  <Mic className="mr-2 h-5 w-5" /> Record Your Voice
                </Link>
              </Button>
              {/* --- End Updated Button --- */}
              <p className="text-sm text-[#3282b8]">
                By participating, you agree to our{" "}
                <Link href="#" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      {/* Footer remains the same */}
      <footer className="border-t border-[#bfd7ed] bg-[#f8fafc] py-6">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <WaveformCircle className="h-6 w-6 text-[#0f4c75]" />
              <span className="text-sm font-bold text-[#0f4c75]">
                VOX VOICE RESEARCH
              </span>
            </div>
            <div className="text-sm text-[#3282b8]">
              © {new Date().getFullYear()} Vox Research. All rights reserved.
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
    </div>
  );
}
