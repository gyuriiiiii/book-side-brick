// src/components/FallingText.tsx
import { useRef, useEffect } from 'react';
import Matter from 'matter-js';

interface FallingTextProps {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
  isActive?: boolean;
}

export const FallingText = ({
  text,
  className = '',
  delay = 0,
  charDelay = 50,
  isActive = true
}: FallingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current || !textRef.current || !canvasContainerRef.current) return;

    const { Engine, Render, World, Bodies, Runner } = Matter;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    // 엔진 생성
    const engine = Engine.create();
    engine.world.gravity.y = 1;
    engineRef.current = engine;

    // 렌더러 생성
    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false
      }
    });

    // 경계 생성 - 바닥은 화면 하단에 위치
    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: 'transparent' }
    };
    const floor = Bodies.rectangle(width / 2, height - 50, width, 100, boundaryOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, boundaryOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, boundaryOptions);

    // 글자별로 물리 바디 생성
    const charSpans = textRef.current.querySelectorAll('.char');

    // 떨어지는 위치를 3개 구역으로 나누기 (왼쪽, 중앙, 오른쪽)
    const dropZones = [
      width * 0.25,  // 왼쪽 (25% 지점)
      width * 0.5,   // 중앙 (50% 지점)
      width * 0.75   // 오른쪽 (75% 지점)
    ];

    const charBodies = Array.from(charSpans).map((elem, index) => {
      const htmlElem = elem as HTMLElement;
      const rect = htmlElem.getBoundingClientRect();

      // 순차적으로 각 구역에서 떨어지도록 설정
      const zoneIndex = index % dropZones.length;
      const x = dropZones[zoneIndex] + (Math.random() - 0.5) * 80;
      const y = -50; // 화면 위에서 시작

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.4,
        frictionAir: 0.005,
        friction: 0.5
      });

      // 순차적으로 떨어지도록 지연 추가
      setTimeout(() => {
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2,
          y: 0
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
      }, delay + index * charDelay);

      return { elem: htmlElem, body };
    });

    // 글자 위치를 absolute로 변경하고 보이게 설정
    charBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = 'translate(-50%, -50%)';
      elem.style.visibility = 'visible';
      elem.style.zIndex = '10';
    });

    // World에 추가
    World.add(engine.world, [floor, leftWall, rightWall, ...charBodies.map(cb => cb.body)]);

    // Runner 시작
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // 업데이트 루프
    const updateLoop = () => {
      charBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    // 정리
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas);
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [isActive, text, delay, charDelay]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        ref={textRef}
        className={className}
        style={{
          position: 'relative',
          top: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap'
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="char"
            style={{
              display: 'inline-block',
              userSelect: 'none'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
      <div ref={canvasContainerRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }} />
    </div>
  );
};
