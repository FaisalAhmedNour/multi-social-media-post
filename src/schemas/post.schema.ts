import { z } from 'zod';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']; // mp4, mov

const fileSchema = z
  .instanceof(File, { message: 'Please select a file' })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: 'File size must be less than 200MB',
  })
  .refine(
    (file) => {
      const mimeType = file.type;
      return (
        ACCEPTED_IMAGE_TYPES.includes(mimeType) ||
        ACCEPTED_VIDEO_TYPES.includes(mimeType)
      );
    },
    {
      message: 'File must be an image (jpg, png) or video (mp4, mov)',
    }
  );

export const postSchema = z.object({
  caption: z
    .string()
    .min(5, 'Caption must be at least 5 characters long')
    .trim(),
  file: fileSchema,
  platforms: z.object({
    facebook: z.boolean(),
    instagram: z.boolean(),
    linkedin: z.boolean(),
  }).refine(
    (data) => data.facebook || data.instagram || data.linkedin,
    {
      message: 'Please select at least one platform',
    }
  ),
});

export type PostFormData = z.infer<typeof postSchema>;


