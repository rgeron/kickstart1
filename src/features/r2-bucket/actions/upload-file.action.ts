"use server";

import { uploadFileToS3 } from "../utils/awss3.utils";

export async function uploadFileAction(formData: FormData, userId: string) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    if (file.size === 0) {
      return {
        success: false,
        error: "File is empty",
      };
    }

    const result = await uploadFileToS3({
      file,
      prefix: `users/${userId}`,
      filename: file.name,
    });

    return {
      success: true,
      url: result.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: "Failed to upload file",
    };
  }
}