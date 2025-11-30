// src/data/top50BorrowedBooks.ts
// 도서대출내역(2025.3.1.~2025.8.31.).xlsx 에서 추출한 상위 50권의 대출 도서

export interface BorrowedBook {
  id: string;
  title: string;
  borrowCount: number;
}

export const TOP_50_BORROWED_BOOKS: BorrowedBook[] = [
  { id: 'book-1', title: '이방인', borrowCount: 54 },
  { id: 'book-2', title: '데미안', borrowCount: 50 },
  { id: 'book-3', title: '국제경제론', borrowCount: 49 },
  { id: 'book-4', title: '모순', borrowCount: 46 },
  { id: 'book-5', title: '사랑의 기술', borrowCount: 42 },
  { id: 'book-6', title: '유기화학', borrowCount: 37 },
  { id: 'book-7', title: '미분적분학', borrowCount: 35 },
  { id: 'book-8', title: '(Kreyszig) 공업수학', borrowCount: 33 },
  { id: 'book-9', title: '파과', borrowCount: 32 },
  { id: 'book-10', title: '게임이론', borrowCount: 32 },
  { id: 'book-11', title: '소년이 온다', borrowCount: 31 },
  { id: 'book-12', title: '구의 증명', borrowCount: 31 },
  { id: 'book-13', title: '회로이론', borrowCount: 29 },
  { id: 'book-14', title: '선형대수학', borrowCount: 29 },
  { id: 'book-15', title: '1984', borrowCount: 27 },
  { id: 'book-16', title: '채식주의자', borrowCount: 27 },
  { id: 'book-17', title: '모래 사나이', borrowCount: 27 },
  { id: 'book-18', title: '정의란 무엇인가', borrowCount: 27 },
  { id: 'book-19', title: '위대한 개츠비', borrowCount: 26 },
  { id: 'book-20', title: '경제학원론', borrowCount: 26 },
  { id: 'book-21', title: '인간실격', borrowCount: 26 },
  { id: 'book-22', title: '노르웨이의 숲', borrowCount: 26 },
  { id: 'book-23', title: '군림천하', borrowCount: 26 },
  { id: 'book-24', title: '차라투스트라는 이렇게 말했다', borrowCount: 25 },
  { id: 'book-25', title: '싯다르타', borrowCount: 24 },
  { id: 'book-26', title: '新民事訴訟法', borrowCount: 24 },
  { id: 'book-27', title: '마음', borrowCount: 24 },
  { id: 'book-28', title: '참을 수 없는 존재의 가벼움', borrowCount: 23 },
  { id: 'book-29', title: '전기화학', borrowCount: 22 },
  { id: 'book-30', title: '구조해석', borrowCount: 22 },
  { id: 'book-31', title: '그리고 아무도 없었다', borrowCount: 21 },
  { id: 'book-32', title: '모던 철도', borrowCount: 21 },
  { id: 'book-33', title: '해커스 토익', borrowCount: 21 },
  { id: 'book-34', title: 'IFRS 밀레니엄 회계원리', borrowCount: 21 },
  { id: 'book-35', title: '회색 인간', borrowCount: 21 },
  { id: 'book-36', title: '레 미제라블', borrowCount: 21 },
  { id: 'book-37', title: '사피엔스', borrowCount: 21 },
  { id: 'book-38', title: '전자기학', borrowCount: 21 },
  { id: 'book-39', title: '안나 카레니나', borrowCount: 20 },
  { id: 'book-40', title: '상상된 공동체', borrowCount: 20 },
  { id: 'book-41', title: '데뷔 못 하면 죽는 병 걸림', borrowCount: 20 },
  { id: 'book-42', title: '데이터베이스 개론', borrowCount: 19 },
  { id: 'book-43', title: '홍학의 자리', borrowCount: 19 },
  { id: 'book-44', title: '작별하지 않는다', borrowCount: 19 },
  { id: 'book-45', title: '단순한 열정', borrowCount: 19 },
  { id: 'book-46', title: '리틀 라이프', borrowCount: 19 },
  { id: 'book-47', title: '생산운영관리', borrowCount: 19 },
  { id: 'book-48', title: 'JLPT 콕콕 찍어주마', borrowCount: 19 },
  { id: 'book-49', title: '토지', borrowCount: 19 },
  { id: 'book-50', title: '민법총칙', borrowCount: 18 }
];
