"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type SubmitResult = {
  success?: boolean;
  error?: string;
};

export async function submitRecordingAction(
  formData: FormData,
): Promise<SubmitResult> {
  const supabase = await createClient();

  const userId = formData.get("userId") as string;
  const gender = formData.get("gender") as string;
  const ageRange = formData.get("ageRange") as string;
  const filePath = formData.get("filePath") as string;
  const phraseText = formData.get("phraseText") as string;

  // Basic validation
  if (!userId || !gender || !ageRange || !filePath || !phraseText) {
    return { error: "Missing required fields." };
  }

  // Validate user session just in case
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== userId) {
    return { error: "Authentication error or User ID mismatch." };
  }

  try {
    // First check if the file exists in storage
    const { data: fileExists, error: fileCheckError } = await supabase.storage
      .from("recordings")
      .list("", {
        search: filePath,
      });

    if (fileCheckError) {
      console.error("Error checking file:", fileCheckError);
      return { error: `Storage error: ${fileCheckError.message}` };
    }

    if (!fileExists || fileExists.length === 0) {
      return {
        error:
          "Uploaded file not found in storage. Please try recording again.",
      };
    }

    // Insert metadata into the database
    const { error: dbError } = await supabase.from("voice_recordings").insert({
      user_id: userId,
      gender: gender,
      age_range: ageRange,
      file_path: filePath,
      phrase_text: phraseText,
    });

    if (dbError) {
      console.error("Database Insert Error:", dbError);
      // Consider deleting the uploaded file if DB insert fails
      await supabase.storage.from("recordings").remove([filePath]);
      return { error: `Database error: ${dbError.message}` };
    }

    // Optionally revalidate paths if needed
    revalidatePath("/protected/record");

    // If there's an admin dashboard, revalidate that too
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return { error: `An unexpected error occurred: ${error.message}` };
  }
}

// Helper function to generate a signed URL for downloading (if your bucket is private)
export async function getRecordingUrlAction(
  filePath: string,
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient();

    // Validate the user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required" };
    }

    // Get a signed URL (expires in 60 seconds)
    const { data, error } = await supabase.storage
      .from("recordings")
      .createSignedUrl(filePath, 60);

    if (error) {
      console.error("Error creating signed URL:", error);
      return { error: `Storage error: ${error.message}` };
    }

    return { url: data.signedUrl };
  } catch (error: any) {
    console.error("Error getting signed URL:", error);
    return { error: `Unexpected error: ${error.message}` };
  }
}
