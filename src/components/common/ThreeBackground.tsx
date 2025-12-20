"use client";

import { useEffect, useRef, useCallback } from "react";

interface Point3D {
    x: number;
    y: number;
    z: number;
    originalZ: number;
}

interface ThreeBackgroundProps {
    className?: string;
}

export default function ThreeBackground({ className = "" }: ThreeBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const pointsRef = useRef<Point3D[]>([]);
    const animationRef = useRef<number | undefined>(undefined);
    const timeRef = useRef(0);

    // Grid configuration
    const GRID_SIZE = 30;
    const GRID_SPACING = 40;
    const WAVE_AMPLITUDE = 30;
    const WAVE_SPEED = 0.02;
    const MOUSE_INFLUENCE = 80;
    const PERSPECTIVE = 800;

    const initPoints = useCallback(() => {
        const points: Point3D[] = [];
        const offsetX = (GRID_SIZE * GRID_SPACING) / 2;
        const offsetY = (GRID_SIZE * GRID_SPACING) / 2;

        for (let i = 0; i <= GRID_SIZE; i++) {
            for (let j = 0; j <= GRID_SIZE; j++) {
                points.push({
                    x: i * GRID_SPACING - offsetX,
                    y: j * GRID_SPACING - offsetY,
                    z: 0,
                    originalZ: 0,
                });
            }
        }
        pointsRef.current = points;
    }, []);

    const project = useCallback((point: Point3D, centerX: number, centerY: number) => {
        const scale = PERSPECTIVE / (PERSPECTIVE + point.z);
        return {
            x: centerX + point.x * scale,
            y: centerY + point.y * scale,
            scale,
        };
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#0A1628");
        gradient.addColorStop(0.5, "#0F2040");
        gradient.addColorStop(1, "#0A1628");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        timeRef.current += WAVE_SPEED;
        const time = timeRef.current;

        // Update points with wave and mouse effect
        pointsRef.current.forEach((point, idx) => {
            const waveX = Math.sin(point.x * 0.02 + time) * WAVE_AMPLITUDE;
            const waveY = Math.cos(point.y * 0.02 + time) * WAVE_AMPLITUDE;

            // Mouse influence
            const normalizedMouseX = (mouseRef.current.x - 0.5) * width;
            const normalizedMouseY = (mouseRef.current.y - 0.5) * height;
            const dx = point.x - normalizedMouseX;
            const dy = point.y - normalizedMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const mouseEffect = Math.max(0, 1 - distance / 300) * MOUSE_INFLUENCE;

            point.z = waveX + waveY + mouseEffect;
        });

        // Draw grid lines
        ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
        ctx.lineWidth = 1;

        // Horizontal lines
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            for (let j = 0; j <= GRID_SIZE; j++) {
                const point = pointsRef.current[i * (GRID_SIZE + 1) + j];
                const projected = project(point, centerX, centerY);

                if (j === 0) {
                    ctx.moveTo(projected.x, projected.y);
                } else {
                    ctx.lineTo(projected.x, projected.y);
                }
            }
            ctx.stroke();
        }

        // Vertical lines
        for (let j = 0; j <= GRID_SIZE; j++) {
            ctx.beginPath();
            for (let i = 0; i <= GRID_SIZE; i++) {
                const point = pointsRef.current[i * (GRID_SIZE + 1) + j];
                const projected = project(point, centerX, centerY);

                if (i === 0) {
                    ctx.moveTo(projected.x, projected.y);
                } else {
                    ctx.lineTo(projected.x, projected.y);
                }
            }
            ctx.stroke();
        }

        // Draw intersection points with glow
        pointsRef.current.forEach((point) => {
            const projected = project(point, centerX, centerY);
            const intensity = Math.max(0.1, Math.min(0.6, (point.z + 50) / 100));

            // Glow effect
            const glowSize = 3 + point.z * 0.03;
            const glowGradient = ctx.createRadialGradient(
                projected.x, projected.y, 0,
                projected.x, projected.y, glowSize * 2
            );
            glowGradient.addColorStop(0, `rgba(59, 130, 246, ${intensity})`);
            glowGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, glowSize * 2, 0, Math.PI * 2);
            ctx.fill();

            // Point
            ctx.fillStyle = `rgba(96, 165, 250, ${intensity + 0.2})`;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, 1.5 * projected.scale, 0, Math.PI * 2);
            ctx.fill();
        });

        animationRef.current = requestAnimationFrame(draw);
    }, [project]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: (e.clientY - rect.top) / rect.height,
        };
    }, []);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, []);

    useEffect(() => {
        handleResize();
        initPoints();

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [draw, handleMouseMove, handleResize, initPoints]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 w-full h-full ${className}`}
            style={{ zIndex: 0 }}
        />
    );
}
