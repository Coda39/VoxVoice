// src/utils/registerWavEncoder.ts
import { register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

// utils/registerWavEncoder.ts
let isWavEncoderRegistered = false;

export const registerWavEncoder = async () => {
  // Only run in browser environment
  if (typeof window === "undefined") {
    console.log("Not in browser, skipping WAV encoder registration");
    return;
  }

  if (!isWavEncoderRegistered) {
    try {
      const { register } = await import("extendable-media-recorder");
      const { connect } = await import("extendable-media-recorder-wav-encoder");

      console.log("Registering WAV encoder...");
      await register(await connect());
      isWavEncoderRegistered = true;
      console.log("WAV encoder registered successfully.");
    } catch (error) {
      console.error("Failed to register WAV encoder:", error);
    }
  }
};
