'use client';

import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface RingTossProps {
  config: {
    message?: string;
    ringCount?: number;
  };
  onComplete: () => void;
}

export function RingToss({ config, onComplete }: RingTossProps) {
  const { message = 'ปาห่วงให้โดนขวด!', ringCount = 5 } = config;
  const [tossedRings, setTossedRings] = useState(0);
  const [hits, setHits] = useState(0);
  const [currentAnimation, setCurrentAnimation] = useState(false);

  const bottles = [
    { id: 1, x: 30, y: 70 },
    { id: 2, x: 50, y: 70 },
    { id: 3, x: 70, y: 70 },
  ];

  const handleToss = (bottleId: number) => {
    if (tossedRings >= ringCount || currentAnimation) return;

    setCurrentAnimation(true);
    const isHit = Math.random() > 0.4; // 60% โอกาสโดน

    if (isHit) {
      setHits(hits + 1);
    }

    setTossedRings(tossedRings + 1);

    setTimeout(() => {
      setCurrentAnimation(false);
      if (tossedRings + 1 >= ringCount) {
        setTimeout(() => onComplete(), 2000);
      }
    }, 1000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 500,
        background: 'linear-gradient(135deg, rgba(156,39,176,0.98) 0%, rgba(103,58,183,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 2,
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        ⭕ {message}
      </Typography>

      <Typography variant="h6" sx={{ color: 'white', mb: 4, fontWeight: 600 }}>
        โดน: {hits}/{tossedRings} | เหลือ: {ringCount - tossedRings} ห่วง
      </Typography>

      <AnimatePresence mode="wait">
        {tossedRings < ringCount ? (
          <Box
            sx={{
              position: 'relative',
              height: 350,
              width: '100%',
            }}
          >
            {bottles.map((bottle) => (
              <motion.div
                key={bottle.id}
                onClick={() => handleToss(bottle.id)}
                style={{
                  position: 'absolute',
                  left: `${bottle.x}%`,
                  top: `${bottle.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: currentAnimation ? 'wait' : 'pointer',
                }}
                whileHover={!currentAnimation ? { scale: 1.1, y: -10 } : {}}
                whileTap={!currentAnimation ? { scale: 0.95 } : {}}
              >
                <Box
                  sx={{
                    fontSize: '4rem',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  }}
                >
                  🍾
                </Box>
              </motion.div>
            ))}

            {currentAnimation && (
              <motion.div
                initial={{ y: -100, x: '50%', opacity: 1 }}
                animate={{ y: 300, x: '50%', opacity: 0 }}
                transition={{ duration: 1 }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  fontSize: '3rem',
                }}
              >
                ⭕
              </motion.div>
            )}
          </Box>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Box sx={{ py: 6 }}>
              <Typography variant="h1" sx={{ mb: 2, fontSize: '6rem' }}>
                {hits >= 4 ? '🏆' : hits >= 2 ? '⭐' : '💪'}
              </Typography>
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
                โดน {hits}/{ringCount} ห่วง
              </Typography>
              <Typography variant="h5" sx={{ color: 'white' }}>
                {hits >= 4 ? 'เทพมาก! 🎉' : hits >= 2 ? 'เก่งเลย! 👍' : 'พยายามอีกนิด! 💪'}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
}
