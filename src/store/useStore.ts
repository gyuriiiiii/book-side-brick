// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OLWork } from '../api/openLibrary';

export type BookStatus = 'reading' | 'read' | 'todo';

interface Store {
  books: OLWork[];
  filteredBooks: OLWork[];
  bookmarkedIds: string[];      // Firestore에 저장될 ID 리스트
  searchQuery: string;
  yearRange: [number, number]; // [min, max]
  subjects: string[];           // 선택된 주제(필터)
  setBooks: (books: OLWork[]) => void;
  setSearchQuery: (q: string) => void;
  setYearRange: (rng: [number, number]) => void;
  setSubjects: (subs: string[]) => void;
  toggleBookmark: (id: string) => void;
  applyFilters: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      books: [],
      filteredBooks: [],
      bookmarkedIds: [],
      searchQuery: '',
      yearRange: [1500, new Date().getFullYear()],
      subjects: [],

      setBooks: (books) => {
        set({ books, filteredBooks: books });
      },

      setSearchQuery: (q) => {
        set({ searchQuery: q });
        get().applyFilters();
      },

      setYearRange: (rng) => {
        set({ yearRange: rng });
        get().applyFilters();
      },

      setSubjects: (subs) => {
        set({ subjects: subs });
        get().applyFilters();
      },

      toggleBookmark: (id) => {
        const cur = get().bookmarkedIds;
        set({
          bookmarkedIds: cur.includes(id)
            ? cur.filter((i) => i !== id)
            : [...cur, id],
        });
      },

      /** 내부 필터 로직 */
      applyFilters: () => {
        const { books, searchQuery, yearRange, subjects } = get();
        const [minY, maxY] = yearRange;

        const f = books.filter((b) => {
          // ① 검색어 (제목·저자·주제)
          const txtMatch =
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.authors.some((a) =>
              a.name.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            (b.subject?.some((s) =>
              s.toLowerCase().includes(searchQuery.toLowerCase())
            ) ?? false);

          // ② 연도 구간
          const year = b.first_publish_year ?? 0;
          const yearMatch = year >= minY && year <= maxY;

          // ③ 주제(Subject) 선택
          const subjMatch =
            subjects.length === 0 ||
            (b.subject?.some((s) => subjects.includes(s)) ?? false);

          return txtMatch && yearMatch && subjMatch;
        });

        set({ filteredBooks: f });
      },
    }),
    {
      name: 'book-culture-store', // localStorage 키
    }
  )
);
