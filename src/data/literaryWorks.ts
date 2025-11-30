// src/data/literaryWorks.ts
export interface LiteraryWork {
  id: string;
  title: string;
  titleKo: string; // 한국어 제목
  author: string;
  authorKo: string; // 한국어 저자명
  year: number;
  country: string;
  location: {
    lat: number;
    lng: number;
    cityName: string; // 도시명
  };
  famousQuote: string; // 명문장
  quoteKo: string; // 명문장 한국어 번역
  description?: string; // 작품 설명
}

export const LITERARY_WORKS: LiteraryWork[] = [
  {
    id: 'lw-001',
    title: 'One Hundred Years of Solitude',
    titleKo: '백년의 고독',
    author: 'Gabriel García Márquez',
    authorKo: '가브리엘 가르시아 마르케스',
    year: 1967,
    country: 'Colombia',
    location: { lat: 4.7109, lng: -74.0721, cityName: 'Bogotá' },
    famousQuote: 'The secret of a good old age is simply an honorable pact with solitude.',
    quoteKo: '좋은 노년의 비밀은 단지 고독과의 명예로운 약속일 뿐이다.',
    description: '마르케스의 대표작으로 마콘도를 배경으로 부엔디아 가문의 7대에 걸친 이야기'
  },
  {
    id: 'lw-002',
    title: 'The Great Gatsby',
    titleKo: '위대한 개츠비',
    author: 'F. Scott Fitzgerald',
    authorKo: 'F. 스콧 피츠제럴드',
    year: 1925,
    country: 'USA',
    location: { lat: 40.7128, lng: -74.0060, cityName: 'New York' },
    famousQuote: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    quoteKo: '그래서 우리는 끊임없이 과거로 떠밀려 가면서도 조류를 거슬러 노를 저어간다.',
    description: '1920년대 뉴욕 롱아일랜드를 배경으로 한 재즈 시대의 비극적 사랑 이야기'
  },
  {
    id: 'lw-003',
    title: 'Crime and Punishment',
    titleKo: '죄와 벌',
    author: 'Fyodor Dostoevsky',
    authorKo: '표도르 도스토옙스키',
    year: 1866,
    country: 'Russia',
    location: { lat: 59.9343, lng: 30.3351, cityName: 'Saint Petersburg' },
    famousQuote: 'Pain and suffering are always inevitable for a large intelligence and a deep heart.',
    quoteKo: '고통과 괴로움은 위대한 지성과 깊은 마음을 가진 사람에게 항상 따라온다.',
    description: '상트페테르부르크를 배경으로 한 라스콜리니코프의 범죄와 구원의 이야기'
  },
  {
    id: 'lw-004',
    title: 'Pride and Prejudice',
    titleKo: '오만과 편견',
    author: 'Jane Austen',
    authorKo: '제인 오스틴',
    year: 1813,
    country: 'England',
    location: { lat: 51.5074, lng: -0.1278, cityName: 'London' },
    famousQuote: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    quoteKo: '많은 재산을 가진 독신 남자에게는 아내가 필요하다는 것이 보편적으로 인정되는 진실이다.',
    description: '19세기 영국 시골 마을을 배경으로 한 엘리자베스 베넷과 다아시의 사랑 이야기'
  },
  {
    id: 'lw-005',
    title: 'The Metamorphosis',
    titleKo: '변신',
    author: 'Franz Kafka',
    authorKo: '프란츠 카프카',
    year: 1915,
    country: 'Czech Republic',
    location: { lat: 50.0755, lng: 14.4378, cityName: 'Prague' },
    famousQuote: 'I cannot make you understand. I cannot make anyone understand what is happening inside me.',
    quoteKo: '나는 당신이 이해하게 할 수 없다. 내 안에서 무슨 일이 일어나고 있는지 누구도 이해시킬 수 없다.',
    description: '프라하를 배경으로 벌레로 변한 그레고르 잠자의 부조리한 이야기'
  },
  {
    id: 'lw-006',
    title: 'The Stranger',
    titleKo: '이방인',
    author: 'Albert Camus',
    authorKo: '알베르 카뮈',
    year: 1942,
    country: 'Algeria',
    location: { lat: 36.7538, lng: 3.0588, cityName: 'Algiers' },
    famousQuote: 'Mother died today. Or maybe yesterday; I can\'t be sure.',
    quoteKo: '오늘 어머니가 돌아가셨다. 아니 어쩌면 어제였을지도 모른다.',
    description: '알제리를 배경으로 한 뫼르소의 실존주의적 이야기'
  },
  {
    id: 'lw-007',
    title: 'The Tale of Genji',
    titleKo: '겐지 이야기',
    author: 'Murasaki Shikibu',
    authorKo: '무라사키 시키부',
    year: 1010,
    country: 'Japan',
    location: { lat: 35.0116, lng: 135.7681, cityName: 'Kyoto' },
    famousQuote: 'The memories of long love gather like drifting snow.',
    quoteKo: '오랜 사랑의 기억은 흩날리는 눈처럼 쌓인다.',
    description: '헤이안 시대 교토를 배경으로 한 겐지 황자의 사랑과 정치 이야기'
  },
  {
    id: 'lw-008',
    title: 'Les Misérables',
    titleKo: '레 미제라블',
    author: 'Victor Hugo',
    authorKo: '빅토르 위고',
    year: 1862,
    country: 'France',
    location: { lat: 48.8566, lng: 2.3522, cityName: 'Paris' },
    famousQuote: 'Even the darkest night will end and the sun will rise.',
    quoteKo: '가장 어두운 밤도 끝나고 태양은 다시 떠오른다.',
    description: '19세기 파리를 배경으로 장발장의 구원과 사회 정의를 다룬 대서사시'
  },
  {
    id: 'lw-009',
    title: 'Don Quixote',
    titleKo: '돈키호테',
    author: 'Miguel de Cervantes',
    authorKo: '미겔 데 세르반테스',
    year: 1605,
    country: 'Spain',
    location: { lat: 40.4168, lng: -3.7038, cityName: 'Madrid' },
    famousQuote: 'The truth may be stretched thin, but it never breaks, and it always surfaces above lies.',
    quoteKo: '진실은 얇게 늘어날 수는 있어도 결코 부서지지 않으며, 항상 거짓 위에 떠오른다.',
    description: '라만차 지방을 배경으로 돈키호테와 산초 판사의 모험 이야기'
  },
  {
    id: 'lw-010',
    title: 'Things Fall Apart',
    titleKo: '모든 것이 산산이 부서지다',
    author: 'Chinua Achebe',
    authorKo: '치누아 아체베',
    year: 1958,
    country: 'Nigeria',
    location: { lat: 6.5244, lng: 3.3792, cityName: 'Lagos' },
    famousQuote: 'A man who calls his kinsmen to a feast does not do so to save them from starving.',
    quoteKo: '친족을 잔치에 부르는 사람은 그들을 굶주림에서 구하기 위해 그러는 것이 아니다.',
    description: '19세기 말 나이지리아 이보족 마을을 배경으로 식민지화의 비극을 다룬 작품'
  },
  {
    id: 'lw-011',
    title: 'Norwegian Wood',
    titleKo: '노르웨이의 숲',
    author: 'Haruki Murakami',
    authorKo: '무라카미 하루키',
    year: 1987,
    country: 'Japan',
    location: { lat: 35.6762, lng: 139.6503, cityName: 'Tokyo' },
    famousQuote: 'If you only read the books that everyone else is reading, you can only think what everyone else is thinking.',
    quoteKo: '다른 사람들이 읽는 책만 읽는다면, 다른 사람들이 생각하는 것만 생각할 수밖에 없다.',
    description: '1960년대 도쿄를 배경으로 한 와타나베의 청춘과 상실의 이야기'
  },
  {
    id: 'lw-012',
    title: 'The God of Small Things',
    titleKo: '작은 것들의 신',
    author: 'Arundhati Roy',
    authorKo: '아룬다티 로이',
    year: 1997,
    country: 'India',
    location: { lat: 9.9312, lng: 76.2673, cityName: 'Kottayam' },
    famousQuote: 'Things can change in a day. That something so small can bring about something so big.',
    quoteKo: '하루 만에 모든 것이 바뀔 수 있다. 그토록 작은 것이 그토록 큰 것을 가져올 수 있다.',
    description: '인도 케랄라를 배경으로 쌍둥이 남매의 금지된 사랑과 카스트 제도를 다룬 이야기'
  },
  {
    id: 'lw-013',
    title: 'Love in the Time of Cholera',
    titleKo: '콜레라 시대의 사랑',
    author: 'Gabriel García Márquez',
    authorKo: '가브리엘 가르시아 마르케스',
    year: 1985,
    country: 'Colombia',
    location: { lat: 10.3910, lng: -75.4794, cityName: 'Cartagena' },
    famousQuote: 'It is not true that people stop pursuing dreams because they grow old, they grow old because they stop pursuing dreams.',
    quoteKo: '사람들이 늙어서 꿈을 추구하지 않는 것이 아니라, 꿈을 추구하지 않아서 늙는 것이다.',
    description: '카르타헤나를 배경으로 50년 넘게 이어진 플로렌티노 아리사의 사랑 이야기'
  },
  {
    id: 'lw-014',
    title: 'The Picture of Dorian Gray',
    titleKo: '도리안 그레이의 초상',
    author: 'Oscar Wilde',
    authorKo: '오스카 와일드',
    year: 1890,
    country: 'England',
    location: { lat: 51.5074, lng: -0.1278, cityName: 'London' },
    famousQuote: 'The only way to get rid of a temptation is to yield to it.',
    quoteKo: '유혹을 없애는 유일한 방법은 그것에 굴복하는 것이다.',
    description: '빅토리아 시대 런던을 배경으로 영원한 젊음과 도덕적 타락을 다룬 고딕 소설'
  },
  {
    id: 'lw-015',
    title: 'The Alchemist',
    titleKo: '연금술사',
    author: 'Paulo Coelho',
    authorKo: '파울로 코엘료',
    year: 1988,
    country: 'Brazil',
    location: { lat: -22.9068, lng: -43.1729, cityName: 'Rio de Janeiro' },
    famousQuote: 'When you want something, all the universe conspires in helping you to achieve it.',
    quoteKo: '무언가를 간절히 원할 때 온 우주가 그것을 이룰 수 있도록 도와준다.',
    description: '스페인과 이집트를 여행하는 양치기 산티아고의 자아 발견 여정'
  }
];
