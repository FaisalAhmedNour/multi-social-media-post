import { z } from 'zod';

export const postSchema = z.object({
  caption: z
    .string()
    .min(5, 'Caption must be at least 5 characters long')
    .trim(),
  imageUrl: z
    .string()
    .url('Please enter a valid image URL')
    .trim(),
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


