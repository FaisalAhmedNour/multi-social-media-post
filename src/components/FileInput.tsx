import { Controller, Control, FieldError, UseFormWatch } from 'react-hook-form';
import { PostFormData } from '../schemas/post.schema';
import { useMemo } from 'react';

interface FileInputProps {
  control: Control<PostFormData>;
  watch: UseFormWatch<PostFormData>;
  error?: FieldError;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

export const FileInput = ({ control, watch, error }: FileInputProps) => {
  const file = watch('file');

  const fileInfo = useMemo(() => {
    if (!file || !(file instanceof File)) return null;
    return {
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type.startsWith('image/') ? 'image' : 'video',
    };
  }, [file]);

  return (
    <div className="space-y-2">
      <label
        htmlFor="file"
        className="block text-sm font-medium text-gray-700"
      >
        Media File <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-4">
        <label
          htmlFor="file"
          className={`flex-1 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            error
              ? 'border-red-500 bg-red-50 hover:bg-red-100'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {fileInfo ? 'Change file' : 'Click to upload or drag and drop'}
            </span>
            <span className="text-xs text-gray-500">
              Images: JPG, PNG | Videos: MP4, MOV (Max 200MB)
            </span>
          </div>
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                id="file"
                type="file"
                accept="image/jpeg,image/jpg,image/png,video/mp4,video/mkv,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) {
                    onChange(selectedFile);
                  }
                }}
              />
            )}
          />
        </label>
      </div>

      {fileInfo && (
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {fileInfo.type === 'image' ? (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {fileInfo.name}
                </p>
                <p className="text-xs text-gray-500">
                  {fileInfo.type.toUpperCase()} • {fileInfo.size}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
};

