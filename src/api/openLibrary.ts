// src/api/openLibrary.ts
import axios from 'axios';

export interface OLWork {
  key: string;
  title: string;
  authors: { name: string }[];
  first_publish_year?: number;
  cover_id?: number;
  subject?: string[];
  places?: string[]; // location 힌트 (예: "Seoul")
}

/** 키워드·필터로 책 검색 → 저자·출판지 힌트 반환 */
export const searchBooks = async (query: string): Promise<OLWork[]> => {
  const { data } = await axios.get(
    `https://openlibrary.org/search.json`,
    { params: { q: query, limit: 200 } }   // 200건 정도까지 받아와도 충분
  );

  // 필요 필드만 뽑아 정제
  return data.docs.map((d: any) => ({
    key: d.key,
    title: d.title,
    authors: d.author_name?.map((n: string) => ({ name: n })) ?? [],
    first_publish_year: d.first_publish_year,
    cover_id: d.cover_i,
    subject: d.subject,
    places: d.place,           // API 가끔 제공, 없으면 빈 배열
  }));
};

/** 표지 이미지 URL */
export const getCoverUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M') =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
    : '/placeholder-book.svg';

/** 상위 50권의 인기 도서 가져오기 */
export const getTop50Books = async (): Promise<OLWork[]> => {
  try {
    // 여러 인기 주제의 책들을 조합하여 50권 가져오기
    const subjects = ['fiction', 'classics', 'philosophy', 'science'];
    const allBooks: OLWork[] = [];

    for (const subject of subjects) {
      const { data } = await axios.get(
        `https://openlibrary.org/subjects/${subject}.json`,
        { params: { limit: 15 } }
      );

      const books = data.works?.map((work: any) => ({
        key: work.key,
        title: work.title,
        authors: work.authors?.map((a: any) => ({ name: a.name })) ?? [],
        first_publish_year: work.first_publish_year,
        cover_id: work.cover_id,
        subject: work.subject,
        places: []
      })) ?? [];

      allBooks.push(...books);

      if (allBooks.length >= 50) break;
    }

    // 중복 제거 및 50권으로 제한
    const uniqueBooks = Array.from(
      new Map(allBooks.map(book => [book.title, book])).values()
    ).slice(0, 50);

    return uniqueBooks;
  } catch (error) {
    console.error('Failed to fetch top 50 books:', error);
    return [];
  }
};
