'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface BalloonPopProps {
  config: {
    message: string;
    balloonCount?: number;
    revealMessage?: string;
  };
  onComplete: () => void;
}

export function BalloonPop({ config, onComplete }: BalloonPopProps) {
  const { message, balloonCount = 8, revealMessage } = config;
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  
  // สร้างข้อมูลลูกโป่งแต่ละอัน
  const balloons = Array.from({ length: balloonCount }, (_, i) => ({
    id: i,
    emoji: ['🎈', '🎉', '💝', '🎁', '✨', '🌟', '💖', '🎊'][i % 8],
    color: ['#FF6B9D', '#C44569', '#F8B500', '#4ECDC4', '#95E1D3', '#C06CFF', '#FF6B6B', '#45B7D1'][i % 8],
    left: 10 + (i * (80 / balloonCount)), // กระจายตำแหน่ง
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  const handleBalloonPop = (index: number) => {
    if (poppedBalloons.includes(index)) return;
    
    const newPopped = [...poppedBalloons, index];
    setPoppedBalloons(newPopped);

    if (newPopped.length === balloonCount) {
      setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => onComplete(), 3000);
      }, 500);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 500,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 2,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          {message}
        </Typography>

        {!showMessage ? (
          <Box 
            sx={{ 
              position: 'relative',
              height: 400,
              mt: 2,
            }}
          >
            <AnimatePresence>
              {balloons.map((balloon) => (
                !poppedBalloons.includes(balloon.id) && (
                  <motion.div
                    key={balloon.id}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ 
                      y: ['-10%', '-20%', '0%'],
                      x: [0, 10, -10, 0],
                      opacity: 1,
                    }}
                    exit={{ 
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.3 }
                    }}
                    transition={{
                      y: {
                        duration: balloon.duration,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                        delay: balloon.delay,
                      },
                      x: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      },
                    }}
                    onClick={() => handleBalloonPop(balloon.id)}
                    style={{
                      position: 'absolute',
                      left: `${balloon.left}%`,
                      top: '50%',
                      cursor: 'pointer',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0 }}
                    >
                      <Box
                        sx={{
                          width: 80,
                          height: 100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                            bgcolor: balloon.color,
                            zIndex: -1,
                          },
                        }}
                      >
                        {balloon.emoji}
                      </Box>
                    </motion.div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Box sx={{ py: 4 }}>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: 3,
                }}
              >
                <Typography variant="h1" sx={{ mb: 3, fontSize: '5rem' }}>
                  🎉
                </Typography>
              </motion.div>
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.8,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  fontWeight: 600,
                }}
              >
                {revealMessage || message}
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>

      <Typography 
        variant="body2" 
        sx={{ 
          mt: 3, 
          position: 'relative', 
          zIndex: 1,
          color: 'rgba(255,255,255,0.9)',
          fontWeight: 600,
        }}
      >
        {poppedBalloons.length} / {balloonCount} ปาโป่ง 🎈
      </Typography>
    </Paper>
  );
}