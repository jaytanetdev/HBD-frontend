'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Egg {
  id: number;
  x: number;
  y?: number;
  speed: number;
  emoji: string;
}

interface EggShooterProps {
  config: {
    message: string;
    targetScore?: number;
    successMessage?: string;
  };
  onComplete: () => void;
}

export function EggShooter({ config, onComplete }: EggShooterProps) {
  const [score, setScore] = useState(0);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [shooterX, setShooterX] = useState(50);
  const [bullets, setBullets] = useState<{ id: number; x: number; y: number }[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const nextEggId = useRef(0);
  const nextBulletId = useRef(0);

  const targetScore = config.targetScore || 10;
  const eggEmojis = ['🥚', '🎈', '⚽', '🏀', '🎾'];

  // Spawn eggs
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newEgg: Egg = {
        id: nextEggId.current++,
        x: Math.random() * 80 + 10,
        speed: Math.random() * 2 + 3,
        emoji: eggEmojis[Math.floor(Math.random() * eggEmojis.length)],
      };
      setEggs((prev) => [...prev, newEgg]);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move eggs and remove off-screen ones
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setEggs((prev) =>
        prev
          .map((egg) => ({ ...egg, y: (egg.y || 0) + egg.speed }))
          .filter((egg) => (egg.y || 0) < 110)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Move bullets
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, y: bullet.y - 5 }))
          .filter((bullet) => bullet.y > -10)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Check collisions
  useEffect(() => {
    bullets.forEach((bullet) => {
      eggs.forEach((egg) => {
        const eggY = egg.y || 0;
        const distance = Math.sqrt(
          Math.pow(bullet.x - egg.x, 2) + Math.pow(bullet.y - eggY, 2)
        );

        if (distance < 8) {
          // Hit!
          setEggs((prev) => prev.filter((e) => e.id !== egg.id));
          setBullets((prev) => prev.filter((b) => b.id !== bullet.id));
          setScore((prev) => prev + 1);
        }
      });
    });
  }, [bullets, eggs]);

  // Check win condition
  useEffect(() => {
    if (score >= targetScore && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [score, targetScore, gameOver, onComplete]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameOver || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setShooterX(Math.max(5, Math.min(95, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameOver || !gameAreaRef.current) return;
    const touch = e.touches[0];
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    setShooterX(Math.max(5, Math.min(95, x)));
  };

  const shoot = () => {
    if (gameOver) return;
    const newBullet = {
      id: nextBulletId.current++,
      x: shooterX,
      y: 90,
    };
    setBullets((prev) => [...prev, newBullet]);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Score Display */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          bgcolor: 'rgba(255,255,255,0.95)',
          px: 4,
          py: 2,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', textAlign: 'center' }}>
          {score} / {targetScore}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 0.5 }}>
          🎯 คะแนน
        </Typography>
      </Box>

      {/* Message */}
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 700,
          textAlign: 'center',
          mb: 3,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          px: 2,
        }}
      >
        {config.message}
      </Typography>

      {/* Game Area */}
      <Box
        ref={gameAreaRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={shoot}
        sx={{
          width: '100%',
          maxWidth: 600,
          height: { xs: 400, sm: 500, md: 600 },
          position: 'relative',
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 4,
          border: '3px solid rgba(255,255,255,0.3)',
          cursor: 'crosshair',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Instructions */}
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            bgcolor: 'rgba(0,0,0,0.3)',
            px: 2,
            py: 0.5,
            borderRadius: 2,
          }}
        >
          🖱️ เลื่อนเมาส์และคลิกเพื่อยิง | 📱 แตะเพื่อยิง
        </Typography>

        {/* Eggs */}
        <AnimatePresence>
          {eggs.map((egg) => (
            <motion.div
              key={egg.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'absolute',
                left: `${egg.x}%`,
                top: `${egg.y || 0}%`,
                fontSize: '2.5rem',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              {egg.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bullets */}
        {bullets.map((bullet) => (
          <Box
            key={bullet.id}
            sx={{
              position: 'absolute',
              left: `${bullet.x}%`,
              top: `${bullet.y}%`,
              width: 8,
              height: 16,
              bgcolor: '#FFD700',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Shooter */}
        <Box
          sx={{
            position: 'absolute',
            left: `${shooterX}%`,
            bottom: 20,
            transform: 'translateX(-50%)',
            fontSize: '3rem',
            pointerEvents: 'none',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        >
          🎯
        </Box>
      </Box>

      {/* Shoot Button (for mobile) */}
      <Button
        onClick={shoot}
        disabled={gameOver}
        sx={{
          mt: 3,
          px: 4,
          py: 1.5,
          bgcolor: '#FFD700',
          color: '#667eea',
          fontWeight: 700,
          fontSize: '1.1rem',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
          '&:hover': {
            bgcolor: '#FFC700',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(255, 215, 0, 0.6)',
          },
          display: { xs: 'block', sm: 'none' },
        }}
      >
        🔫 ยิง!
      </Button>

      {/* Game Over Message */}
      {gameOver && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'rgba(255,255,255,0.98)',
              p: 4,
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              textAlign: 'center',
              zIndex: 100,
            }}
          >
            <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
              🎉
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
              {config.successMessage || 'เก่งมาก!'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              คุณยิงโดน {score} ครั้ง!
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
