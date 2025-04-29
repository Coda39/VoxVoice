// app/protected/record/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mic, MicOff, Pause, Play, StopCircle } from "lucide-react";
import { submitRecordingAction } from "./actions";
import { FormMessage, Message } from "@/components/form-message";

const phrases = [
  "The rainbow appears after the rain, showcasing vibrant colors while the birds sing sweetly by the flowing stream",
];

export default function RecordPage() {
  const supabase = createClient();
  const router = useRouter();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // MediaRecorder states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [visualizerData, setVisualizerData] = useState<number[]>(
    Array(30).fill(0),
  );

  // Refs for MediaRecorder
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const visualizerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/sign-in");
        } else {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/sign-in");
      }
    };
    getUser();
    setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [supabase, router]);

  // Function to request microphone access
  const getMicrophonePermission = async () => {
    setMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Set up audio context for visualizer
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up visualizer interval
      visualizerIntervalRef.current = setInterval(() => {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        // Simplify data for visualization (take only 30 points)
        const visualData = Array.from(dataArray)
          .filter((_, i) => i % 4 === 0)
          .slice(0, 30);

        setVisualizerData(visualData);
      }, 100);

      return true;
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      setMessage({ error: `Microphone access denied: ${err.message}` });
      return false;
    }
  };

  // Start the recording
  const startRecording = async () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setMessage(null);
    audioChunksRef.current = [];

    // Get microphone permission if needed
    if (!streamRef.current) {
      const permissionGranted = await getMicrophonePermission();
      if (!permissionGranted) return;
    }

    try {
      // Create MediaRecorder instance with best available mime type
      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/mp4";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ""; // Let browser decide
        }
      }

      const mediaRecorder = new MediaRecorder(streamRef.current!, {
        mimeType: mimeType || undefined,
      });

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          console.error("No audio data collected");
          setMessage({
            error: "No audio data was recorded. Please try again.",
          });
          return;
        }

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });
          const url = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(url);
          console.log(
            "Recording stopped, blob created:",
            audioBlob.size,
            "bytes",
          );
        } catch (err) {
          console.error("Error creating audio blob:", err);
          setMessage({
            error: "Error processing recording. Please try again.",
          });
        }
      };

      // Store the MediaRecorder reference
      mediaRecorderRef.current = mediaRecorder;

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);

      // Start timer for recording duration
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);

      console.log(
        "Recording started with mime type:",
        mimeType || "browser default",
      );
    } catch (err: any) {
      console.error("Error starting recording:", err);
      setMessage({ error: `Failed to start recording: ${err.message}` });
    }
  };

  // Stop the recording
  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state === "inactive"
    )
      return;

    try {
      console.log("Stopping recorder...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop the visualizer
      if (visualizerIntervalRef.current) {
        clearInterval(visualizerIntervalRef.current);
        visualizerIntervalRef.current = null;
        setVisualizerData(Array(30).fill(0));
      }
    } catch (err: any) {
      console.error("Error stopping recording:", err);
      setMessage({ error: `Failed to stop recording: ${err.message}` });
    }
  };

  // Pause the recording
  const pauseRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state !== "recording"
    )
      return;

    try {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } catch (err: any) {
      console.error("Error pausing recording:", err);
    }
  };

  // Resume the recording
  const resumeRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.state !== "paused"
    )
      return;

    try {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume the timer
      let seconds = recordingTime;
      timerRef.current = setInterval(() => {
        seconds++;
        setRecordingTime(seconds);
      }, 1000);
    } catch (err: any) {
      console.error("Error resuming recording:", err);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit triggered.");
    console.log("Current userId state:", userId);
    console.log("Current audioBlob exists:", !!audioBlob);
    console.log("Current audioBlob type:", audioBlob?.type);
    console.log("Current audioBlob size:", audioBlob?.size);
    console.log("Current gender:", gender);
    console.log("Current ageRange:", ageRange);
    console.log("Current phrase:", currentPhrase);

    if (!audioBlob || !gender || !ageRange || !userId || !currentPhrase) {
      setMessage({ error: "Please record audio and fill all fields." });
      setIsLoading(false); // Ensure loading stops if validation fails early
      return;
    }

    // Construct the filePath *inside* the handler to ensure latest userId
    const extension = audioBlob.type.includes("webm")
      ? "webm"
      : audioBlob.type.includes("mp4")
        ? "mp4"
        : "wav"; // Or determine more robustly
    const timestamp = Date.now();

    const filePath = `${userId}/${timestamp}.${extension}`; // Use the state userId
    const {
      data: { user: authUser },
      error: authCheckError,
    } = await supabase.auth.getUser();
    if (authCheckError || !authUser) {
      console.error(
        "Authentication check failed before upload:",
        authCheckError,
      );
      setMessage({
        error: "Authentication session issue. Please sign in again.",
      });
      setIsLoading(false);
      return;
    }
    // Verify the userId state matches the currently authenticated user
    if (userId !== authUser.id) {
      console.warn(
        "User ID state mismatch! State:",
        userId,
        "Auth:",
        authUser.id,
        "Attempting to fix state.",
      );
      // It might be safer to force a refresh or show an error,
      // but let's try updating the state for this attempt.
      setUserId(authUser.id);
      // Re-generate filePath with the correct ID
      const filePath = `${authUser.id}/${timestamp}.${extension}`;
      console.log("Regenerated filePath with authUser.id:", filePath);
    } else {
      console.log("User ID state matches authenticated user.");
    }

    console.log("Generated filePath for upload:", filePath); // Log the final path

    setIsLoading(true);
    setMessage(null);

    try {
      // Add logging right before the upload call
      console.log(
        `Attempting upload to Supabase Storage: bucket=recordings, path=${filePath}`,
      );

      const { data, error: uploadError } = await supabase.storage
        .from("recordings")
        .upload(filePath, audioBlob, {
          cacheControl: "3600",
          upsert: true, // Restore this
          contentType: audioBlob.type || "audio/webm",
        });

      // Log the immediate result
      console.log("Supabase storage upload result:", { data, uploadError });

      if (uploadError) {
        // Log the specific uploadError object before throwing
        console.error("Upload Error Object:", uploadError);
        // Use a more specific error message if possible
        const errorMessage = uploadError.message || JSON.stringify(uploadError);
        throw new Error(`Storage Upload Error: ${errorMessage}`);
      }
      console.log("Upload successful, data:", data);

      // Create form data for server action
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("gender", gender);
      formData.append("ageRange", ageRange);
      formData.append("filePath", filePath);
      formData.append("phraseText", currentPhrase);

      // Submit to server action
      console.log("Submitting to server action");
      const result = await submitRecordingAction(formData);
      console.log("Server action result:", result);

      if (result.error) {
        setMessage({ error: result.error });
      } else {
        setMessage({ success: "Recording submitted successfully! Thank you." });
        setAudioBlob(null);
        setAudioUrl(null);
        setGender("");
        setAgeRange("");
        setRecordingTime(0);
        setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
      }
    } catch (error: any) {
      console.error("Submission failed in catch block:", error);
      setMessage({
        error: `Submission failed: ${error.message || "Please try again."}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center max-w-2xl mx-auto p-4">
      {/* Heading and Phrase display */}
      <h1 className="text-3xl font-bold text-center">Contribute Your Voice</h1>
      <p className="text-center text-muted-foreground">
        Please read the following phrase clearly into your microphone. Ensure
        you are in a quiet environment.
      </p>

      <div className="w-full p-6 border rounded-lg bg-card text-center">
        <p className="text-xl font-medium">{currentPhrase}</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4 bg-muted/50 p-6 rounded-lg border">
          {/* Audio Visualizer */}
          <div className="w-full h-16 flex items-end justify-center gap-0.5 mb-2">
            {visualizerData.map((value, index) => (
              <div
                key={index}
                className="w-1.5 bg-primary rounded-t-sm transition-all duration-100"
                style={{
                  height: `${Math.max((value / 255) * 100, 2)}%`,
                  opacity: isRecording && !isPaused ? 1 : 0.4,
                }}
              ></div>
            ))}
          </div>

          {/* Recording Time Display */}
          <div className="text-2xl font-mono mb-4">
            {formatTime(recordingTime)}
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button
                type="button"
                onClick={startRecording}
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 flex items-center justify-center"
              >
                <Mic size={24} />
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button
                    type="button"
                    onClick={pauseRecording}
                    variant="outline"
                    className="rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    <Pause size={20} />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={resumeRecording}
                    variant="outline"
                    className="rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    <Play size={20} />
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={stopRecording}
                  variant="destructive"
                  className="rounded-full w-16 h-16 flex items-center justify-center"
                >
                  <StopCircle size={24} />
                </Button>
              </>
            )}
          </div>

          {/* Audio Preview */}
          {audioUrl && (
            <div className="mt-6 flex flex-col items-center gap-2 w-full">
              <p className="text-sm font-medium">Preview your recording:</p>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full mt-2"
              />
            </div>
          )}
        </div>

        {/* Metadata Select fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={gender}
              onValueChange={setGender}
              required
              disabled={isLoading}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ageRange">Age Range</Label>
            <Select
              value={ageRange}
              onValueChange={setAgeRange}
              required
              disabled={isLoading}
            >
              <SelectTrigger id="ageRange">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="26-35">26-35</SelectItem>
                <SelectItem value="36-45">36-45</SelectItem>
                <SelectItem value="46-55">46-55</SelectItem>
                <SelectItem value="56+">56+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button and Message */}
        <Button type="submit" disabled={!audioBlob || isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit Recording"
          )}
        </Button>

        {message && (
          <div className="mt-4 flex justify-center">
            <FormMessage message={message} />
          </div>
        )}
      </form>
    </div>
  );
}
