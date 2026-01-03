import axios, { AxiosError } from 'axios';
import { PostFormData } from '../schemas/post.schema';

export interface WebhookResponse {
  success: boolean;
  message?: string;
}

export class WebhookServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError?: boolean
  ) {
    super(message);
    this.name = 'WebhookServiceError';
  }
}

const getMediaType = (file: File): 'image' | 'video' => {
  return file.type.startsWith('image/') ? 'image' : 'video';
};

export const submitPost = async (
  data: PostFormData,
  onProgress?: (progress: number) => void
): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new WebhookServiceError(
      'Webhook URL is not configured. Please set VITE_N8N_WEBHOOK_URL in your environment variables.'
    );
  }

  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('text', data.caption);
  formData.append('mediaType', getMediaType(data.file));
  formData.append(
    'platforms',
    JSON.stringify({
      facebook: data.platforms.facebook,
      instagram: data.platforms.instagram,
      linkedin: data.platforms.linkedin,
    })
  );

  try {
    console.log('Submitting form data:', {
      file: formData.get('file') ? {
        name: (formData.get('file') as File)?.name,
        size: (formData.get('file') as File)?.size,
        type: (formData.get('file') as File)?.type,
      } : 'NO FILE',
      text: formData.get('text'),
      mediaType: formData.get('mediaType'),
      platforms: formData.get('platforms'),
    });

    const response = await axios.post<WebhookResponse>(
      webhookUrl,
      formData,
      {
        timeout: 60000, // 60 seconds for large file uploads
        // Don't set Content-Type manually - Axios will set it with the correct boundary
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      }
    );

    return {
      success: true,
      message: response.data.message || 'Post submitted successfully!',
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNABORTED') {
        throw new WebhookServiceError(
          'Upload timed out. The file may be too large or your connection is slow. Please try again.',
          undefined,
          true
        );
      }

      if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
        throw new WebhookServiceError(
          'Network error. Please check your connection and try again.',
          undefined,
          true
        );
      }

      const statusCode = axiosError.response.status;
      const errorData = axiosError.response.data as { message?: string } | undefined;
      const errorMessage =
        errorData?.message ||
        `Server error (${statusCode}). Please try again later.`;

      throw new WebhookServiceError(errorMessage, statusCode, false);
    }

    throw new WebhookServiceError(
      'An unexpected error occurred. Please try again.'
    );
  }
};


