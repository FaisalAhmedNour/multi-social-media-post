import { PostForm } from '../components/PostForm';

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Social Media Post Manager
            </h1>
            <p className="text-gray-600">
              Create and schedule posts across multiple platforms
            </p>
          </div>

          <PostForm />
        </div>
      </div>
    </div>
  );
};


