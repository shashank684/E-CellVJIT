import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const GlobalBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle Starfield Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: Array<{ x: number; y: number; size: number; speed: number }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Clear any existing stars and re-populate for new dimensions
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.3 + 0.05,
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!ctx || !canvas) return;

      // Ensure the entire canvas is cleared before drawing anything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black"; // Ensure background is black to blend with overall theme
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    const animationFrameId = requestAnimationFrame(animate); // Store the ID
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId); // Properly cancel on unmount
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      {/* Starfield Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Glowing Nebula Overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(216,32,50,0.15) 0%, transparent 60%)",
        }}
        animate={{
          background: [
            "radial-gradient(circle at 30% 50%, rgba(216,32,50,0.15) 0%, transparent 60%)",
            "radial-gradient(circle at 70% 30%, rgba(147,51,234,0.15) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 80%, rgba(216,32,50,0.15) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
