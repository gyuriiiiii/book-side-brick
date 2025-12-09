// src/components/BookSlideshow.tsx
import { useState, useEffect, useRef } from 'react';
import { TOP_50_BORROWED_BOOKS } from '../data/top50BorrowedBooks';
import Matter from 'matter-js';

const SLIDE_DURATION = 2000; // 2초
const MAX_DURATION = 2 * 60 * 1000 + 40 * 1000; // 2분 40초 (160초)

// 크리스마스 컨셉 색상 배열
const COLORS = [
// 빨강
  '#029696', // 초록
  '#1e3a8a', // 진한 파랑
   // 진한 보라색
  // 주황
  '#DD6E55', // 금색
  '#000000', // 검정
   // 핑크
 // 청록
];

export const BookSlideshow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(true); // 활성화 상태

  // 상위 50권 대출 도서 데이터 사용
  const books = TOP_50_BORROWED_BOOKS;

  useEffect(() => {
    if (!containerRef.current || books.length === 0) return;

    const { Engine, Render, World, Bodies, Runner } = Matter;

    const width = 5760;
    const height = 1080;

    // 엔진 생성
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;

    // 렌더러 생성
    const render = Render.create({
      element: containerRef.current,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false
      }
    });
    renderRef.current = render;

    // 경계 생성
    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };
    const floor = Bodies.rectangle(width / 2, height - 50, width, 100, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);

    World.add(engine.world, [floor, leftWall, rightWall]);

    // Runner 시작
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 타이머 설정
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, SLIDE_DURATION);

    // 4분 후 타이머 중지
    const stopTimer = setTimeout(() => {
      clearInterval(timer);
      setIsActive(false);
    }, MAX_DURATION);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [books]);

  // 새 책 제목 추가
  useEffect(() => {
    if (!engineRef.current || !containerRef.current || books.length === 0 || !isActive) return;

    const currentBook = books[currentIndex];
    const { World, Bodies, Body } = Matter;

    // 임시 텍스트로 전체 크기 측정
    const tempDiv = document.createElement('div');
    tempDiv.className = 'text-6xl font-bold text-gray-900';
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.whiteSpace = 'nowrap';
    tempDiv.textContent = currentBook.title;
    containerRef.current.appendChild(tempDiv);

    const rect = tempDiv.getBoundingClientRect();
    containerRef.current.removeChild(tempDiv);

    // 3개 구역 정의 (왼쪽, 중앙, 오른쪽)
    const dropZones = [
      5760 * 0.25,  // 1번: 왼쪽 (35
      5760 * 0.75,  // 3번: 오른쪽 (65 
      5760 * 0.5    // 2번: 중앙 (50
    ];

    // 순서대로 1번 -> 3번 -> 2번 위치 선택
    const zoneIndex = currentIndex % dropZones.length;
    const x = dropZones[zoneIndex];
    const y = -200;

    const bookBody = Bodies.rectangle(x, y, rect.width, rect.height, {
      render: { fillStyle: 'transparent' },
      restitution: 0.9, // 통통 튀는 효과 증가
      frictionAir: 0.01,
      friction: 0.5,
      density: 0.001
    });

    // 랜덤 색상 선택
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    // 표시용 div 생성
    const displayDiv = document.createElement('div');
    displayDiv.textContent = currentBook.title;
    displayDiv.className = 'text-6xl font-bold';
    displayDiv.style.position = 'absolute';
    displayDiv.style.left = `${x}px`;
    displayDiv.style.top = `${y}px`;
    displayDiv.style.transform = 'translate(-50%, -50%)';
    displayDiv.style.userSelect = 'none';
    displayDiv.style.zIndex = '10';
    displayDiv.style.whiteSpace = 'nowrap';
    displayDiv.style.color = randomColor;
    containerRef.current.appendChild(displayDiv);

    World.add(engineRef.current.world, bookBody);

    // 약간의 초기 회전 속도
    Body.setAngularVelocity(bookBody, (Math.random() - 0.5) * 0.05);

    // 업데이트 루프
    const updateLoop = () => {
      const { x, y } = bookBody.position;
      displayDiv.style.left = `${x}px`;
      displayDiv.style.top = `${y}px`;
      displayDiv.style.transform = `translate(-50%, -50%) rotate(${bookBody.angle}rad)`;
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    // cleanup은 필요 없음 - 계속 쌓여야 하므로

  }, [currentIndex, books, isActive]);

  return (
    <div
      className="bg-white"
      style={{
        width: '5760px',
        height: '1080px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 크리스마스 전구 장식 */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '150px',
          zIndex: 100,
          pointerEvents: 'none'
        }}
      >
        {/* 빛나는 효과 필터 */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 전선 */}
        <path
          d="M 0,50 Q 240,80 480,50 T 960,50 T 1440,50 T 1920,50 T 2400,50 T 2880,50 T 3360,50 T 3840,50 T 4320,50 T 4800,50 T 5280,50 T 5760,50"
          stroke="#2D3748"
          strokeWidth="3"
          fill="none"
        />

        {/* 전구들 */}
        {Array.from({ length: 16 }).map((_, i) => {
          const x = (i * 360) + 180; // 간격 늘림 (240 -> 360)
          const y = i % 2 === 0 ? 50 : 80;
          // 노랑과 연한 주황 색상만 사용
          const lightColors = ['#FCD34D', '#FB923C']; // 노랑, 연한 주황
          const lightColor = lightColors[i % lightColors.length];

          return (
            <g key={i}>
              {/* 전선에서 전구까지 연결선 */}
              <line x1={x} y1={50} x2={x} y2={y + 15} stroke="#2D3748" strokeWidth="2" />

              {/* 반짝이는 후광 효과 */}
              <circle
                cx={x}
                cy={y + 25}
                r="30"
                fill={lightColor}
                opacity="0"
              >
                <animate
                  attributeName="opacity"
                  values="0;0.4;0"
                  dur={`${2.5 + (i % 3) * 0.8}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
                <animate
                  attributeName="r"
                  values="25;35;25"
                  dur={`${2.5 + (i % 3) * 0.8}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </circle>

              {/* 전구 - 원형으로 변경 */}
              <circle
                cx={x}
                cy={y + 25}
                r="20"
                fill={lightColor}
                opacity="0.95"
                filter="url(#glow)"
              >
                <animate
                  attributeName="opacity"
                  values="0.95;0.6;0.95"
                  dur={`${2.5 + (i % 3) * 0.8}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </circle>

              {/* 전구 하이라이트 */}
              <circle
                cx={x - 6}
                cy={y + 19}
                r="7"
                fill="white"
                opacity="0.8"
              >
                <animate
                  attributeName="opacity"
                  values="0.8;0.5;0.8"
                  dur={`${2.5 + (i % 3) * 0.8}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};