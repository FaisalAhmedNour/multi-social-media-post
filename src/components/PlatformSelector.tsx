import { UseFormRegister } from 'react-hook-form';
import { PostFormData } from '../schemas/post.schema';

interface PlatformSelectorProps {
  register: UseFormRegister<PostFormData>;
  errors?: {
    platforms?: {
      message?: string;
    };
  };
}

export const PlatformSelector = ({
  register,
  errors,
}: PlatformSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Platforms <span className="text-red-500">*</span>
      </label>
      
      <div className="space-y-2">
        <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            {...register('platforms.facebook')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Facebook</span>
        </label>

        <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            {...register('platforms.instagram')}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
          />
          <span className="text-gray-700 font-medium">Instagram</span>
        </label>

        <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors">
          <input
            type="checkbox"
            {...register('platforms.linkedin')}
            className="w-4 h-4 text-blue-700 border-gray-300 rounded focus:ring-blue-700 focus:ring-2"
          />
          <span className="text-gray-700 font-medium">LinkedIn</span>
        </label>
      </div>

      {errors?.platforms && (
        <p className="text-sm text-red-600 mt-1">
          {errors.platforms.message}
        </p>
      )}
    </div>
  );
};


