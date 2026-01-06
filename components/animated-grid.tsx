'use client';

import { useEffect, useRef } from 'react';

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

    const gridSpacing = 65;
    const dotRadius = 2;
    const connectionDistance = 160;
    const dragStrength = 0.015;
    const maxDisplacement = 20;

    const recalculatePoints = () => {
      const cols = Math.ceil(canvas.width / gridSpacing) + 2;
      const rows = Math.ceil(canvas.height / gridSpacing) + 2;

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
          const x = i * gridSpacing;
          const y = j * gridSpacing;
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

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
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

        const gravityFalloff = 1 / (1 + distFromMouse * 0.005);
        const dragFactor = gravityFalloff * dragStrength;

        point.vx += dx * dragFactor;
        point.vy += dy * dragFactor;

        const returnDx = point.baseX - point.x;
        const returnDy = point.baseY - point.y;
        point.vx += returnDx * 0.04;
        point.vy += returnDy * 0.04;

        point.vx *= 0.94;
        point.vy *= 0.94;

        point.x += point.vx;
        point.y += point.vy;

        const currentDisplacementX = point.x - point.baseX;
        const currentDisplacementY = point.y - point.baseY;
        const currentDisplacement = Math.hypot(currentDisplacementX, currentDisplacementY);

        if (currentDisplacement > maxDisplacement) {
          const scale = maxDisplacement / currentDisplacement;
          point.x = point.baseX + currentDisplacementX * scale;
          point.y = point.baseY + currentDisplacementY * scale;
          point.vx *= 0.7;
          point.vy *= 0.7;
        }
      });

      points.forEach((point, i) => {
        points.slice(i + 1).forEach(otherPoint => {
          const distance = Math.hypot(point.x - otherPoint.x, point.y - otherPoint.y);
          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;

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
        ctx.arc(point.x, point.y, dotRadius, 0, Math.PI * 2);
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

  return (
    <canvas
      ref={canvasRef}
      className='absolute inset-0 h-full w-full'
      style={{ opacity: 0.4, zIndex: 1 }}
    />
  );
}
