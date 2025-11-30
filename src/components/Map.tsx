// src/components/Map.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  LayersControl,
  useMap,
} from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getCoverUrl } from '../api/openLibrary';
import type { OLWork } from '../api/openLibrary';
import L from 'leaflet';
import { StoryModal } from './StoryModal';
import { LoadingSpinner } from './LoadingSpinner';
import { COUNTRY_CENTROIDS } from '../lib/countryCentroids';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LITERARY_WORKS } from '../data/literaryWorks';
import type { LiteraryWork } from '../data/literaryWorks';

// Leaflet 기본 아이콘 경로 설정
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// 시네마틱 투어 시퀀스 (서쪽 → 동쪽 순서)
const TOUR_SEQUENCE = [
  'lw-002', // 뉴욕 - 위대한 개츠비
  'lw-004', // 런던 - 오만과 편견
  'lw-008', // 파리 - 레 미제라블
  'lw-009', // 마드리드 - 돈키호테
  'lw-005', // 프라하 - 변신
  'lw-003', // 상트페테르부르크 - 죄와 벌
  'lw-006', // 알제 - 이방인
  'lw-010', // 라고스 - 모든 것이 산산이 부서지다
  'lw-012', // 인도 - 작은 것들의 신
  'lw-007', // 교토 - 겐지 이야기
  'lw-011', // 도쿄 - 노르웨이의 숲
];

// 각 작품별 머무는 시간 (초)
const STAY_DURATION = 4; // 8초
const TRANSITION_DURATION = 1.5; // 2초

// 카메라 컨트롤러 컴포넌트
function CinematicTourController({
  tourWorks,
  currentIndex,
  onIndexChange
}: {
  tourWorks: LiteraryWork[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (currentIndex >= tourWorks.length) {
      // 투어 종료 - 처음으로 돌아가기
      onIndexChange(0);
      return;
    }

    const work = tourWorks[currentIndex];

    // 현재 위치로 부드럽게 이동
    map.flyTo(
      [work.location.lat, work.location.lng],
      5, // 줌 레벨
      {
        duration: TRANSITION_DURATION,
        easeLinearity: 0.25,
      }
    );

    // 다음 작품으로 이동하는 타이머
    const timer = setTimeout(() => {
      onIndexChange(currentIndex + 1);
    }, (STAY_DURATION + TRANSITION_DURATION) * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, tourWorks, map, onIndexChange]);

  return null;
}

export const Map = () => {
  const { filteredBooks, bookmarkedIds, toggleBookmark } = useStore();
  const [selectedBook, setSelectedBook] = useState<OLWork | null>(null);
  const [isStoryOpen, setStoryOpen] = useState(false);
  const [isCinematicMode, setIsCinematicMode] = useState(true);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [showWorkInfo, setShowWorkInfo] = useState(false);

  // 투어 시퀀스에 해당하는 작품들
  const tourWorks = TOUR_SEQUENCE.map(id =>
    LITERARY_WORKS.find(w => w.id === id)
  ).filter(Boolean) as LiteraryWork[];

  const currentWork = tourWorks[currentTourIndex];

  // 작품 정보 표시 타이밍
  useEffect(() => {
    if (!isCinematicMode) return;

    // 전환 시간 이후에 정보 표시
    const showTimer = setTimeout(() => {
      setShowWorkInfo(true);
    }, TRANSITION_DURATION * 1000);

    // 다음 전환 전에 정보 숨기기
    const hideTimer = setTimeout(() => {
      setShowWorkInfo(false);
    }, (STAY_DURATION + TRANSITION_DURATION - 2) * 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [currentTourIndex, isCinematicMode]);

  // 지도 초기 설정
  const INITIAL_CENTER: [number, number] = [40, -80];
  const INITIAL_ZOOM = 3;

  /** 책이 속한 국가 좌표 찾기 */
  const getBookLatLng = (book: OLWork): [number, number] => {
    const place = book.places?.[0];
    if (place) {
      const known = Object.keys(COUNTRY_CENTROIDS).find((c) =>
        place.toLowerCase().includes(c.toLowerCase())
      );
      if (known) {
        const coords = COUNTRY_CENTROIDS[known as keyof typeof COUNTRY_CENTROIDS];
        if (coords) return coords;
      }
    }

    if (book.authors?.[0]?.name) {
      const author = book.authors[0].name;
      if (/대한|한국/.test(author)) {
        const koreaCoords = COUNTRY_CENTROIDS['대한민국' as keyof typeof COUNTRY_CENTROIDS];
        if (koreaCoords) return koreaCoords;
      }
    }

    return INITIAL_CENTER;
  };

  // 마커 아이콘
  const bookIcon = (book: OLWork) =>
    L.icon({
      iconUrl: getCoverUrl(book.cover_id, 'S') ?? '/placeholder-book.png',
      iconSize: [30, 40],
    });

  const literaryIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f59e0b" stroke="#92400e" stroke-width="1.5">
        <circle cx="12" cy="12" r="10" fill="#f59e0b" opacity="0.9"/>
        <path d="M12 6.5c3.04 0 5.5 2.46 5.5 5.5s-2.46 5.5-5.5 5.5S6.5 15.04 6.5 12s2.46-5.5 5.5-5.5M12 5C8.13 5 5 8.13 5 12s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7z" fill="#92400e"/>
        <path d="M8 10h8M8 12h8M8 14h6" stroke="#92400e" stroke-width="1" fill="none"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  const createClusterCustomIcon = (cluster: any) => {
    return L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: 'marker-cluster-custom',
      iconSize: L.point(40, 40, true),
    });
  };

  // 총 투어 시간 계산
  const totalDuration = tourWorks.length * (STAY_DURATION + TRANSITION_DURATION);
  const currentTime = currentTourIndex * (STAY_DURATION + TRANSITION_DURATION);
  const progress = (currentTime / totalDuration) * 100;

  return (
    <div className="flex-1 relative">
      <MapContainer
        center={INITIAL_CENTER}
        zoom={INITIAL_ZOOM}
        className="h-full w-full"
        attributionControl={false}
        zoomControl={false}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Stamen Toner">
            <TileLayer
              url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* 시네마틱 투어 컨트롤러 */}
        {isCinematicMode && (
          <CinematicTourController
            tourWorks={tourWorks}
            currentIndex={currentTourIndex}
            onIndexChange={setCurrentTourIndex}
          />
        )}

        {/* 문학 작품 마커 */}
        {LITERARY_WORKS.map((work) => (
          <Marker
            key={work.id}
            position={[work.location.lat, work.location.lng]}
            icon={literaryIcon}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={0.95} permanent={false}>
              <div className="text-sm font-semibold">
                {work.titleKo}
                <br />
                <span className="text-xs text-gray-600">{work.authorKo}</span>
              </div>
            </Tooltip>
          </Marker>
        ))}

        {/* 책 검색 결과 마커 */}
        <MarkerClusterGroup iconCreateFunction={createClusterCustomIcon}>
          {filteredBooks.map((book) => {
            const pos = getBookLatLng(book);
            return (
              <Marker
                key={book.key}
                position={pos as [number, number]}
                icon={bookIcon(book)}
                eventHandlers={{
                  click: () => {
                    setSelectedBook(book);
                    setStoryOpen(true);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -12]} opacity={0.9}>
                  <div className="text-sm">
                    <strong>{book.title}</strong>
                    <br />
                    {book.authors?.map((a) => a.name).join(', ')}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {/* 시네마틱 작품 정보 오버레이 */}
      {isCinematicMode && showWorkInfo && currentWork && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[900]">
          <div className="bg-black/75 backdrop-blur-md text-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto animate-fadeIn">
            {/* 제목 */}
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold mb-3">{currentWork.titleKo}</h1>
              <p className="text-2xl text-gray-300 italic mb-2">{currentWork.title}</p>
              <p className="text-xl text-amber-400">
                {currentWork.authorKo} <span className="text-gray-400">({currentWork.year})</span>
              </p>
            </div>

            {/* 명문장 */}
            <div className="border-t-2 border-amber-500 pt-6 mb-6">
              <p className="text-2xl leading-relaxed mb-4 text-center font-serif">
                "{currentWork.quoteKo}"
              </p>
              <p className="text-lg text-gray-400 italic text-center">
                "{currentWork.famousQuote}"
              </p>
            </div>

            {/* 위치 정보 */}
            <div className="flex items-center justify-center gap-3 text-lg text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span>{currentWork.location.cityName}, {currentWork.country}</span>
            </div>

            {/* 작품 설명 */}
            {currentWork.description && (
              <p className="text-center text-gray-300 mt-6 text-lg">
                {currentWork.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 프로그레스 바 */}
      {isCinematicMode && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000]">
          <div className="bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-8">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-white text-sm font-medium">
                {currentTourIndex + 1} / {tourWorks.length}
              </span>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-white text-sm">
                {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 컨트롤 버튼 */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-3">
        <button
          onClick={() => setIsCinematicMode(!isCinematicMode)}
          className="px-6 py-3 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm rounded-lg shadow-lg font-semibold transition-all"
        >
          {isCinematicMode ? '🎬 투어 중' : '🗺️ 탐색 모드'}
        </button>

        {isCinematicMode && (
          <button
            onClick={() => setCurrentTourIndex((currentTourIndex + 1) % tourWorks.length)}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg font-semibold transition-all"
          >
            ⏭️ 다음
          </button>
        )}
      </div>

      {/* 책 상세 모달 */}
      {selectedBook && (
        <StoryModal
          book={selectedBook}
          isOpen={isStoryOpen}
          onClose={() => setStoryOpen(false)}
          isBookmarked={bookmarkedIds.includes(selectedBook.key)}
          onToggleBookmark={() => toggleBookmark(selectedBook.key)}
        />
      )}

      {/* 로딩 스피너 */}
      {filteredBooks.length === 0 && !isCinematicMode && <LoadingSpinner />}
    </div>
  );
};
