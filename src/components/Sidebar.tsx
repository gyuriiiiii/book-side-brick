// src/components/Sidebar.tsx
import { useState } from 'react';
import { useStore } from '../store/useStore';
import Select from 'react-select';
import { Range } from 'react-range';
import { FaSearch, FaBookmark } from 'react-icons/fa';

export const Sidebar = () => {
  const {
    setSearchQuery,
    setYearRange,
    setSubjects,
    toggleBookmark,
    bookmarkedIds,
    filteredBooks,
  } = useStore();

  const [query, setQuery] = useState('');
  const [yearRange, setLocalYearRange] = useState<[number, number]>([
    1500,
    new Date().getFullYear(),
  ]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // 전체 책에서 Subject 리스트 추출 (중복 제거)
  const allSubjects = Array.from(
    new Set(
      filteredBooks.flatMap((b) => b.subject ?? [])
    )
  ).sort();

  const applyAll = () => {
    setSearchQuery(query);
    setYearRange(yearRange);
    setSubjects(selectedSubjects);
  };

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 p-4 overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      {/* 검색 */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="제목·저자·주제 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyAll()}
        />
        <button
          className="p-2 bg-primary text-white rounded"
          onClick={applyAll}
        >
          <FaSearch />
        </button>
      </div>

      {/* 연도 슬라이더 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          출판 연도
        </h3>
        <Range
          step={10}
          min={1500}
          max={new Date().getFullYear()}
          values={yearRange}
          onChange={(values) => setLocalYearRange(values as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 bg-gray-200 dark:bg-gray-600 rounded"
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-4 h-4 bg-primary rounded-full shadow"
            />
          )}
        />
        <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>

      {/* 주제 다중 선택 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          주제 (Subject)
        </h3>
        <Select
          isMulti
          options={allSubjects.map((s) => ({ label: s, value: s }))}
          value={selectedSubjects.map((s) => ({ label: s, value: s }))}
          onChange={(opts) =>
            setSelectedSubjects(opts ? opts.map((o) => o.value) : [])
          }
          classNamePrefix="react-select"
        />
      </div>

      {/* 북마크 목록 (선택적) */}
      <div>
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          북마크 (읽은 책)
        </h3>
        {bookmarkedIds.length === 0 ? (
          <p className="text-xs text-gray-500">북마크한 책이 없습니다.</p>
        ) : (
          <ul className="space-y-1">
            {bookmarkedIds.map((id) => (
              <li key={id} className="flex items-center">
                <button
                  className="flex-1 text-left text-sm truncate hover:underline"
                  onClick={() => {
                    // 지도에서 해당 마커가 열리게 하는 로직은 store → mapRef 로 구현
                  }}
                >
                  {id}
                </button>
                <button
                  onClick={() => toggleBookmark(id)}
                  className="p-1 text-gray-500 hover:text-red-500"
                >
                  <FaBookmark />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};
