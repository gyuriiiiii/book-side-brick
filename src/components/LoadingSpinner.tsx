// src/components/LoadingSpinner.tsx
export const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          로딩 중...
        </p>
      </div>
    </div>
  );
};
