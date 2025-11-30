// src/components/StoryModal.tsx
import type { OLWork } from '../api/openLibrary';
import { getCoverUrl } from '../api/openLibrary';
import { FaBookmark, FaRegBookmark, FaTimes } from 'react-icons/fa';

interface StoryModalProps {
  book: OLWork;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const StoryModal = ({
  book,
  isOpen,
  onClose,
  isBookmarked,
  onToggleBookmark,
}: StoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {book.authors?.map((a) => a.name).join(', ')}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleBookmark}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {isBookmarked ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark className="text-gray-400" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-6">
            {/* Cover Image */}
            {book.cover_id && (
              <img
                src={getCoverUrl(book.cover_id, 'L')}
                alt={book.title}
                className="w-48 h-auto rounded shadow-lg"
              />
            )}

            {/* Book Info */}
            <div className="flex-1 space-y-4">
              {book.first_publish_year && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    출판 연도
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {book.first_publish_year}
                  </p>
                </div>
              )}

              {book.subject && book.subject.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    주제
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {book.subject.slice(0, 10).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {book.places && book.places.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    장소
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {book.places.slice(0, 5).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
