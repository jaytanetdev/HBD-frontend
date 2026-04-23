'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface Fish {
  id: number;
  x: number;
  y: number;
  emoji: string;
  speed: number;
  direction: number;
}

interface FishingGameProps {
  config: {
    message: string;
    fishCount?: number;
    successMessage?: string;
  };
  onComplete: () => void;
}

export function FishingGame({ config, onComplete }: FishingGameProps) {
  const [caught, setCaught] = useState(0);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [fishing, setFishing] = useState(false);
  const [hookX, setHookX] = useState(50);
  const [hookY, setHookY] = useState(20);
  const [reeling, setReeling] = useState(false);

  const targetCount = config.fishCount || 5;
  const fishEmojis = ['🐟', '🐠', '🐡', '🦈', '🐙'];

  // Spawn fishes
  useEffect(() => {
    const initialFishes: Fish[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 40 + 40,
      emoji: fishEmojis[Math.floor(Math.random() * fishEmojis.length)],
      speed: Math.random() * 0.15 + 0.1, // ⬇️ ลดความเร็วลงมาก (จาก 0.3-0.8 เป็น 0.1-0.25)
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
    setFishes(initialFishes);
  }, []);

  // Move fishes (หยุดเคลื่อนที่ขณะตกเบ็ด เพื่อให้ตกง่าย)
  useEffect(() => {
    if (gameOver || fishing) return; // ⭐ หยุดปลาตอนโยนเบ็ด!

    const interval = setInterval(() => {
      setFishes((prev) =>
        prev.map((fish) => {
          let newX = fish.x + fish.speed * fish.direction;
          let newDirection = fish.direction;

          if (newX > 95 || newX < 5) {
            newDirection = -fish.direction;
            newX = fish.x;
          }

          return { ...fish, x: newX, direction: newDirection };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver, fishing]); // ⭐ เพิ่ม fishing dependency

  // Cast hook และตรวจสอบ collision แบบต่อเนื่อง
  const castHook = () => {
    if (fishing || reeling) return;
    setFishing(true);
    setHookY(20);

    let caughtFishId: number | null = null;
    let alreadyReeling = false; // ⭐ flag เพื่อป้องกันเรียก reelIn ซ้ำ

    // Animate hook dropping + ตรวจสอบปลาทุก frame
    const dropInterval = setInterval(() => {
      setHookY((prev) => {
        if (prev >= 80) {
          clearInterval(dropInterval);
          // ตรวจสอบอีกครั้งตอนเบ็ดถึงพื้น (ถ้ายังไม่ได้จับ)
          if (!caughtFishId && !alreadyReeling) {
            caughtFishId = checkCatch(prev);
            if (caughtFishId !== null) {
              // ลบปลาทันที ก่อน reelIn
              setFishes((prev) => prev.filter((f) => f.id !== caughtFishId));
            }
            alreadyReeling = true;
            reelIn(caughtFishId);
          }
          return prev;
        }

        // ตรวจสอบ collision ระหว่างเบ็ดลง (ทุก frame!)
        if (!caughtFishId && !alreadyReeling && prev > 40) {
          caughtFishId = checkCatch(prev);
          if (caughtFishId !== null) {
            clearInterval(dropInterval);
            // ลบปลาทันที ก่อน reelIn
            setFishes((prev) => prev.filter((f) => f.id !== caughtFishId));
            alreadyReeling = true;
            reelIn(caughtFishId);
            return prev;
          }
        }

        return prev + 2;
      });
    }, 30);
  };

  // Check if hook caught a fish (คืนค่า fish id ถ้าจับได้)
  const checkCatch = (currentHookY: number): number | null => {
    let caughtFishId: number | null = null;

    fishes.forEach((fish) => {
      // ลด hitbox ให้แคบลง (X: 12%, Y: 10%)
      const xDistance = Math.abs(hookX - fish.x);
      const yDistance = Math.abs(currentHookY - fish.y);

      // ถ้าเบ็ดอยู่ใกล้ปลา (พื้นที่จับแคบกว่าเดิม)
      if (xDistance < 12 && yDistance < 10 && caughtFishId === null) {
        caughtFishId = fish.id;
      }
    });

    return caughtFishId;
  };

  // Reel in the hook (with or without fish)
  const reelIn = (fishId: number | null) => {
    if (fishId !== null) {
      // จับปลาได้! (ปลาถูกลบออกจาก state แล้วใน castHook)
      setReeling(true);

      const reelInterval = setInterval(() => {
        setHookY((prev) => {
          if (prev <= 20) {
            clearInterval(reelInterval);
            setFishing(false);
            setReeling(false);
            setCaught((c) => c + 1); // ⭐ นับเพิ่มเพียงครั้งเดียว
            return 20;
          }
          return prev - 2;
        });
      }, 30);
    } else {
      // พลาด กรอกขึ้นมาเปล่าๆ
      const reelInterval = setInterval(() => {
        setHookY((prev) => {
          if (prev <= 20) {
            clearInterval(reelInterval);
            setFishing(false);
            return 20;
          }
          return prev - 2;
        });
      }, 30);
    }
  };

  // Move hook left/right
  const moveHook = (direction: 'left' | 'right') => {
    if (fishing || reeling) return;
    setHookX((prev) => {
      const newX = direction === 'left' ? prev - 8 : prev + 8;
      return Math.max(10, Math.min(90, newX));
    });
  };

  // Check win condition
  useEffect(() => {
    if (caught >= targetCount && !gameOver) {
      setGameOver(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [caught, targetCount, gameOver, onComplete]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sky */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(180deg, #87CEEB 0%, #00BFFF 100%)',
          zIndex: 0,
        }}
      >
        {/* Clouds */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: ['-20%', '120%'] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: `${20 + i * 15}%`,
              fontSize: '2rem',
              opacity: 0.6,
            }}
          >
            ☁️
          </motion.div>
        ))}
      </Box>

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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#3a7bd5', textAlign: 'center' }}>
          {caught} / {targetCount}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', mt: 0.5 }}>
          🐟 ปลาที่จับได้
        </Typography>
      </Box>

      {/* Message */}
      <Typography
        variant="h5"
        sx={{
          color: 'white',
          fontWeight: 700,
          textAlign: 'center',
          mb: 1,
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          px: 2,
          zIndex: 1,
        }}
      >
        {config.message}
      </Typography>

      {/* Instructions */}
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          mb: 3,
          px: 2,
          zIndex: 1,
          bgcolor: 'rgba(0,0,0,0.2)',
          py: 1,
          borderRadius: 2,
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}
      >
        💡 กดซ้าย-ขวาให้เบ็ดอยู่เหนือปลา แล้วกด "โยนเบ็ด" เพื่อจับ!
      </Typography>

      {/* Game Area - Water */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          height: { xs: 400, sm: 500, md: 600 },
          position: 'relative',
          bgcolor: 'rgba(0, 100, 200, 0.3)',
          borderRadius: 4,
          border: '3px solid rgba(255,255,255,0.3)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(180deg, rgba(0,150,255,0.3) 0%, rgba(0,50,150,0.5) 100%)',
          zIndex: 1,
        }}
      >
        {/* Water waves effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 10px, transparent 20px, rgba(255,255,255,0.1) 30px)',
            animation: 'wave 3s linear infinite',
            '@keyframes wave': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '40px 0' },
            },
          }}
        />

        {/* Fishing Rod */}
        <Box
          sx={{
            position: 'absolute',
            left: `${hookX}%`,
            top: 0,
            width: 4,
            height: `${hookY}%`,
            bgcolor: '#8B4513',
            transformOrigin: 'top',
            transform: 'translateX(-50%)',
            zIndex: 5,
            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
          }}
        />

        {/* Hook */}
        <Box
          sx={{
            position: 'absolute',
            left: `${hookX}%`,
            top: `${hookY}%`,
            fontSize: '2.5rem',
            transform: 'translate(-50%, -50%)',
            zIndex: 6,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        >
          🪝
        </Box>

        {/* Debug helper - show catch zone (ใส่เพื่อให้เห็นพื้นที่จับได้) */}
        {(fishing || reeling) && (
          <Box
            sx={{
              position: 'absolute',
              left: `${hookX}%`,
              top: `${hookY}%`,
              width: '24%', // ลดลงเป็น 24% (ตรงกับ xDistance < 12)
              height: '20%', // ลดลงเป็น 20% (ตรงกับ yDistance < 10)
              border: '2px dashed rgba(50, 255, 50, 0.7)', // เปลี่ยนเป็นสีเขียวสว่าง
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
              bgcolor: 'rgba(50, 255, 50, 0.15)',
            }}
          />
        )}

        {/* Fishes */}
        <AnimatePresence>
          {fishes.map((fish) => (
            <motion.div
              key={fish.id}
              animate={{
                scale: [1, 1.15, 1],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: fish.id * 0.2,
              }}
              style={{
                position: 'absolute',
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                fontSize: '3rem',
                transform: `translate(-50%, -50%) scaleX(${fish.direction})`,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              {fish.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Bubbles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: ['100%', '-20%'] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: `${20 + i * 15}%`,
              bottom: 0,
              fontSize: '1.5rem',
              opacity: 0.6,
            }}
          >
            💧
          </motion.div>
        ))}
      </Box>

      {/* Controls */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, zIndex: 1 }}>
        <Button
          onClick={() => moveHook('left')}
          disabled={fishing || reeling || gameOver}
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: '#FFD700',
            color: '#3a7bd5',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
            '&:hover': {
              bgcolor: '#FFC700',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(255, 215, 0, 0.6)',
            },
          }}
        >
          ⬅️ ซ้าย
        </Button>

        <Button
          onClick={castHook}
          disabled={fishing || reeling || gameOver}
          sx={{
            px: 4,
            py: 1.5,
            bgcolor: fishing || reeling ? '#ccc' : '#FF6B6B',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
            '&:hover': {
              bgcolor: '#FF5252',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(255, 107, 107, 0.6)',
            },
          }}
        >
          {fishing || reeling ? '🎣 กำลังตก...' : '🎣 โยนเบ็ด'}
        </Button>

        <Button
          onClick={() => moveHook('right')}
          disabled={fishing || reeling || gameOver}
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: '#FFD700',
            color: '#3a7bd5',
            fontWeight: 700,
            fontSize: '1.1rem',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
            '&:hover': {
              bgcolor: '#FFC700',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(255, 215, 0, 0.6)',
            },
          }}
        >
          ขวา ➡️
        </Button>
      </Box>

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
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#3a7bd5', mb: 1 }}>
              {config.successMessage || 'เก่งมาก! ตกปลาได้ครบแล้ว!'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              คุณจับปลาได้ {caught} ตัว! 🐟
            </Typography>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
