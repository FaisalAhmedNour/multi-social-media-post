import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { postSchema, PostFormData } from '../schemas/post.schema';
import { submitPost, WebhookServiceError } from '../services/webhook.service';
import { PlatformSelector } from './PlatformSelector';
import { FileInput } from './FileInput';
import { SubmitStatus } from './SubmitStatus';

export const PostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'loading' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: '',
      platforms: {
        facebook: false,
        instagram: false,
        linkedin: false,
      },
    },
  });

  const onSubmit = async (data: PostFormData) => {
    console.log('Form submitted with data:', {
      caption: data.caption,
      file: data.file ? {
        name: data.file.name,
        size: data.file.size,
        type: data.file.type,
      } : 'NO FILE',
      platforms: data.platforms,
    });

    if (!data.file) {
      setStatus({
        type: 'error',
        message: 'Please select a file to upload.',
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setStatus({ type: 'loading', message: 'Uploading media...' });

    try {
      const response = await submitPost(data, (progress) => {
        setUploadProgress(progress);
        
        if (progress < 100) {
          setStatus({
            type: 'loading',
            message: `Uploading: ${progress}%`,
          });
        } else {
          setStatus({
            type: 'loading',
            message: 'Processing...',
          });
        }
      });
      
      setUploadProgress(0);
      setStatus({
        type: 'success',
        message: response.message || 'Post submitted successfully!',
      });
      
      // Reset form including file input
      reset();
      // Clear file input manually
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      setUploadProgress(0);
      const errorMessage =
        error instanceof WebhookServiceError
          ? error.message
          : 'An unexpected error occurred. Please try again.';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissStatus = () => {
    setStatus({ type: null, message: '' });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <SubmitStatus
        type={status.type}
        message={status.message}
        progress={uploadProgress}
        onDismiss={handleDismissStatus}
      />

      <div>
        <label
          htmlFor="caption"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Post Caption <span className="text-red-500">*</span>
        </label>
        <textarea
          id="caption"
          {...register('caption')}
          rows={6}
          placeholder="Write your post caption here..."
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.caption
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        {errors.caption && (
          <p className="text-sm text-red-600 mt-1">
            {errors.caption.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Minimum 5 characters required
        </p>
      </div>

      <FileInput control={control} watch={watch} error={errors.file} />

      <PlatformSelector register={register} errors={errors.platforms} />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {status.type === 'loading' && status.message.includes('Uploading')
              ? 'Uploading...'
              : 'Submitting...'}
          </span>
        ) : (
          'Submit Post'
        )}
      </button>
    </form>
  );
};


