import { UseFormRegister, FieldError } from 'react-hook-form';
import { PostFormData } from '../schemas/post.schema';

interface ImageInputProps {
  register: UseFormRegister<PostFormData>;
  error?: FieldError;
}

export const ImageInput = ({ register, error }: ImageInputProps) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor="imageUrl"
        className="block text-sm font-medium text-gray-700"
      >
        Image URL <span className="text-red-500">*</span>
      </label>
      <input
        id="imageUrl"
        type="url"
        {...register('imageUrl')}
        placeholder="https://example.com/image.jpg"
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
      <p className="text-xs text-gray-500">
        Enter a valid image URL or paste a link to your image
      </p>
    </div>
  );
};


