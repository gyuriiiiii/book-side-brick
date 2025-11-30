// src/components/LiteraryWorkCard.tsx
import type { LiteraryWork } from '../data/literaryWorks';

interface LiteraryWorkCardProps {
  work: LiteraryWork;
  position: 'right' | 'left'; // 마커의 왼쪽/오른쪽에 표시할지 결정
}

export const LiteraryWorkCard = ({ work, position }: LiteraryWorkCardProps) => {
  return (
    <div
      className={`
        absolute top-1/2 -translate-y-1/2 z-[1000]
        ${position === 'right' ? 'left-full ml-4' : 'right-full mr-4'}
        bg-white dark:bg-gray-800
        rounded-lg shadow-2xl
        p-4 w-80
        border-2 border-amber-400
        hover:shadow-3xl transition-all duration-300
        animate-fadeIn
      `}
    >
      {/* 화살표 표시 */}
      <div
        className={`
          absolute top-1/2 -translate-y-1/2
          ${position === 'right' ? '-left-2' : '-right-2'}
          w-4 h-4 bg-white dark:bg-gray-800
          border-2 border-amber-400
          ${position === 'right' ? 'border-r-0 border-t-0' : 'border-l-0 border-b-0'}
          rotate-45
        `}
      />

      <div className="space-y-3">
        {/* 제목 */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {work.titleKo}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            {work.title}
          </p>
        </div>

        {/* 저자 */}
        <div className="text-sm">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">
            {work.authorKo}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            ({work.year})
          </span>
        </div>

        {/* 명문장 */}
        <div className="border-l-4 border-amber-400 pl-3 py-2 bg-amber-50 dark:bg-gray-700/50 rounded">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
            "{work.quoteKo}"
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            "{work.famousQuote}"
          </p>
        </div>

        {/* 위치 정보 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>
            {work.location.cityName}, {work.country}
          </span>
        </div>

        {/* 설명 (옵션) */}
        {work.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            {work.description}
          </p>
        )}
      </div>
    </div>
  );
};
