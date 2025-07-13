"use client"

import { CircleUserRoundIcon, XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { uploadFileAction } from "@/features/r2-bucket/actions/upload-file.action"
import { updateUser } from "@/lib/auth/auth-client"

interface AvatarUploadProps {
  userId: string
  currentImage?: string
  onImageUpdate?: (imageUrl: string) => void
}

export function AvatarUpload({ userId, currentImage, onImageUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  
  const [
    { files, isDragging },
    {
      removeFile,
      openFileDialog,
      getInputProps,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  ] = useFileUpload({
    accept: "image/*",
    maxSize: 10 * 1024 * 1024, // 10MB limit to match server config
    onFilesAdded: async (addedFiles) => {
      if (addedFiles.length > 0) {
        await handleFileUpload(addedFiles[0].file as File)
      }
    }
  })

  const previewUrl = files[0]?.preview || currentImage || null

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      
      // Check file size before upload (10MB limit to match server config)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          "Image is too large (max 10MB). Please compress your image using tinypng.com and try again."
        )
        return
      }
      
      const formData = new FormData()
      formData.append("file", file)
      
      // Upload to R2 bucket
      const uploadResult = await uploadFileAction(formData, userId)
      
      if (!uploadResult.success) {
        // Check if it's a size-related error
        if (uploadResult.error?.includes("exceeded") || uploadResult.error?.includes("limit")) {
          toast.error(
            "Image is too large. Please compress your image using tinypng.com and try again."
          )
        } else {
          toast.error(uploadResult.error || "Failed to upload image")
        }
        return
      }

      // Update user profile with new avatar URL
      await updateUser({
        image: uploadResult.url,
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
          onSuccess: () => {
            toast.success("Avatar updated successfully")
            onImageUpdate?.(uploadResult.url!)
            // Refresh the page to show the updated avatar
            setTimeout(() => router.refresh(), 500)
          },
        },
      })
    } catch (error: unknown) {
      console.error("Avatar upload error:", error)
      
      // Handle specific size limit errors
      if ((error as any)?.message?.includes("exceeded") || (error as any)?.message?.includes("limit") || (error as any)?.statusCode === 413) {
        toast.error(
          "Image is too large. Please compress your image using tinypng.com and try again."
        )
      } else {
        toast.error("Failed to update avatar")
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true)
      
      // Clear the uploaded file
      if (files[0]) {
        removeFile(files[0].id)
      }

      // Update user profile to remove avatar
      await updateUser({
        image: "",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
          onSuccess: () => {
            toast.success("Avatar removed successfully")
            onImageUpdate?.("")
            // Refresh the page to show the updated avatar
            setTimeout(() => router.refresh(), 500)
          },
        },
      })
    } catch (error) {
      console.error("Avatar removal error:", error)
      toast.error("Failed to remove avatar")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex">
        {/* Drop area */}
        <button
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-solid has-[img]:border-primary"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={previewUrl ? "Change avatar" : "Upload avatar"}
          disabled={isUploading}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="size-full object-cover"
              src={previewUrl}
              alt="Avatar preview"
              width={96}
              height={96}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-8 opacity-60" />
            </div>
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
        
        {previewUrl && !isUploading && (
          <Button
            onClick={handleRemoveAvatar}
            size="icon"
            variant="destructive"
            className="absolute -top-1 -right-1 size-6 rounded-full shadow-lg"
            aria-label="Remove avatar"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload avatar file"
          tabIndex={-1}
          disabled={isUploading}
        />
      </div>
      
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Click or drag to upload avatar
        </p>
        <p className="text-xs text-muted-foreground">
          Max size: 10MB
        </p>
      </div>
    </div>
  )
}