import axios, { AxiosError } from 'axios';
import { PostFormData } from '../schemas/post.schema';

export interface WebhookPayload {
  text: string;
  imageUrl: string;
  platforms: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
  };
  scheduleAt: null;
}

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

export const submitPost = async (
  data: PostFormData
): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new WebhookServiceError(
      'Webhook URL is not configured. Please set VITE_N8N_WEBHOOK_URL in your environment variables.'
    );
  }

  const payload: WebhookPayload = {
    text: data.caption,
    imageUrl: data.imageUrl,
    platforms: {
      facebook: data.platforms.facebook,
      instagram: data.platforms.instagram,
      linkedin: data.platforms.linkedin,
    },
    scheduleAt: null,
  };

  try {
    const response = await axios.post<WebhookResponse>(
      webhookUrl,
      payload,
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
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
          'Request timed out. Please check your connection and try again.',
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
      const errorMessage =
        axiosError.response.data?.message ||
        `Server error (${statusCode}). Please try again later.`;

      throw new WebhookServiceError(errorMessage, statusCode, false);
    }

    throw new WebhookServiceError(
      'An unexpected error occurred. Please try again.'
    );
  }
};


