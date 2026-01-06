'use client';

import { useEffect, useRef } from 'react';

const GRID_SPACING = 65;
const DOT_RADIUS = 2;
const CONNECTION_DISTANCE = 160;
const DRAG_STRENGTH = 0.015;
const MAX_DISPLACEMENT = 20;
const MOUSE_RESET_POSITION = -1000;
const GRAVITY_FALLOFF_MULTIPLIER = 0.005;
const RETURN_FORCE = 0.04;
const VELOCITY_DAMPING = 0.94;
const COLLISION_DAMPING = 0.7;

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const recalculatePoints = () => {
      const cols = Math.ceil(canvas.width / GRID_SPACING) + 2;
      const rows = Math.ceil(canvas.height / GRID_SPACING) + 2;

      const newPoints: Array<{
        x: number;
        y: number;
        baseX: number;
        baseY: number;
        vx: number;
        vy: number;
      }> = [];

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * GRID_SPACING;
          const y = j * GRID_SPACING;
          newPoints.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
      return newPoints;
    };

    let points = recalculatePoints();

    const mouse = { x: MOUSE_RESET_POSITION, y: MOUSE_RESET_POSITION };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = MOUSE_RESET_POSITION;
      mouse.y = MOUSE_RESET_POSITION;
    };
    const parentSection = canvas.parentElement;
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    const getThemeColor = () => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        dot: isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(71, 85, 105, 0.2)',
        line: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(71, 85, 105, 0.1)',
        primaryLine: isDark ? 'rgba(203, 213, 225, 0.6)' : 'rgba(148, 163, 184, 0.5)',
      };
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colors = getThemeColor();

      points.forEach(point => {
        const dx = mouse.x - point.x;
        const dy = mouse.y - point.y;
        const distFromMouse = Math.hypot(dx, dy);

        const gravityFalloff = 1 / (1 + distFromMouse * GRAVITY_FALLOFF_MULTIPLIER);
        const dragFactor = gravityFalloff * DRAG_STRENGTH;

        point.vx += dx * dragFactor;
        point.vy += dy * dragFactor;

        const returnDx = point.baseX - point.x;
        const returnDy = point.baseY - point.y;
        point.vx += returnDx * RETURN_FORCE;
        point.vy += returnDy * RETURN_FORCE;

        point.vx *= VELOCITY_DAMPING;
        point.vy *= VELOCITY_DAMPING;

        point.x += point.vx;
        point.y += point.vy;

        const currentDisplacementX = point.x - point.baseX;
        const currentDisplacementY = point.y - point.baseY;
        const currentDisplacement = Math.hypot(currentDisplacementX, currentDisplacementY);

        if (currentDisplacement > MAX_DISPLACEMENT) {
          const scale = MAX_DISPLACEMENT / currentDisplacement;
          point.x = point.baseX + currentDisplacementX * scale;
          point.y = point.baseY + currentDisplacementY * scale;
          point.vx *= COLLISION_DAMPING;
          point.vy *= COLLISION_DAMPING;
        }
      });

      points.forEach((point, i) => {
        points.slice(i + 1).forEach(otherPoint => {
          const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
          if (distance < CONNECTION_DISTANCE) {
            const opacity = 1 - distance / CONNECTION_DISTANCE;

            ctx.strokeStyle = colors.line.replace(/[\d.]+\)$/, `${opacity})`);
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(otherPoint.x, otherPoint.y);
            ctx.stroke();
          }
        });

        ctx.beginPath();
        ctx.fillStyle = colors.dot;
        ctx.arc(point.x, point.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      updateSize();
      points = recalculatePoints();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className='absolute inset-0 z-10 h-full w-full opacity-40' />;
}
