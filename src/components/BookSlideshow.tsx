// src/components/BookSlideshow.tsx
import { useState, useEffect, useRef } from 'react';
import { TOP_50_BORROWED_BOOKS } from '../data/top50BorrowedBooks';
import Matter from 'matter-js';

const SLIDE_DURATION = 10000; // 10초

// 색상 배열: 진한 파랑, 진한 보라색, 검정
const COLORS = ['#1e3a8a', '#581c87', '#000000'];

export const BookSlideshow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 상위 50권 대출 도서 데이터 사용
  const books = TOP_50_BORROWED_BOOKS;

  useEffect(() => {
    if (!containerRef.current || books.length === 0) return;

    const { Engine, Render, World, Bodies, Runner } = Matter;

    const width = 5760;
    const height = 1080;

    // 엔진 생성
    const engine = Engine.create();
    engine.world.gravity.y = 1;
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

    return () => {
      clearInterval(timer);
      Render.stop(render);
      Runner.stop(runner);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [books]);

  // 새 책 제목 추가
  useEffect(() => {
    if (!engineRef.current || !containerRef.current || books.length === 0) return;

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

    // 책 제목 전체를 하나의 바디로 생성
    const x = 5760 / 2;
    const y = -200;

    const bookBody = Bodies.rectangle(x, y, rect.width, rect.height, {
      render: { fillStyle: 'transparent' },
      restitution: 0.3,
      frictionAir: 0.01,
      friction: 0.8,
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

  }, [currentIndex, books]);

  return (
    <div
      ref={containerRef}
      className="bg-white"
      style={{
        width: '5760px',
        height: '1080px',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};
