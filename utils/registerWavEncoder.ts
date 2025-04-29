// src/utils/registerWavEncoder.ts
import { register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

let isWavEncoderRegistered = false;

export const registerWavEncoder = async () => {
  if (!isWavEncoderRegistered) {
    try {
      console.log("Registering WAV encoder...");
      await register(await connect());
      isWavEncoderRegistered = true;
      console.log("WAV encoder registered successfully.");
    } catch (error) {
      console.error("Failed to register WAV encoder:", error);
      // Consider more robust error handling here,
      // like setting a global flag that the encoder failed to load
    }
  }
};
