'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface BirthdayCakeProps {
  config: {
    message: string;
    candleCount?: number;
    cakeStyle?: string;
    imageUrl?: string;
  };
  onComplete: () => void;
}

export function BirthdayCake({ config, onComplete }: BirthdayCakeProps) {
  const { message, candleCount = 5, imageUrl } = config;
  const [blownCandles, setBlownCandles] = useState<number[]>([]);
  const [showMessage, setShowMessage] = useState(false);

  const handleBlowCandle = (index: number) => {
    if (blownCandles.includes(index)) return;

    const newBlown = [...blownCandles, index];
    setBlownCandles(newBlown);

    if (newBlown.length === candleCount) {
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
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,248,240,0.98) 0%, rgba(255,235,238,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '2px solid rgba(255,255,255,0.5)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 3,
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7971E 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        🎂 เป่าเทียนให้หมดเพื่อขอพร!
      </Typography>

      {!showMessage ? (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
            {Array.from({ length: candleCount }).map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: blownCandles.includes(index) ? 0 : [1, 1.1, 1],
                }}
                transition={{
                  repeat: blownCandles.includes(index) ? 0 : Infinity,
                  duration: 0.5,
                }}
              >
                <Button
                  onClick={() => handleBlowCandle(index)}
                  disabled={blownCandles.includes(index)}
                  sx={{
                    fontSize: '3rem',
                    minWidth: 50,
                    '&:hover': {
                      transform: 'scale(1.2)',
                    },
                  }}
                >
                  {blownCandles.includes(index) ? '💨' : '🕯️'}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box
            sx={{
              fontSize: '8rem',
              animation: 'bounce 2s ease-in-out infinite',
              '@keyframes bounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
              },
            }}
          >
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt="Birthday Cake"
                sx={{
                  maxWidth: 300,
                  maxHeight: 300,
                  borderRadius: 3,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '4px solid white',
                }}
              />
            ) : (
              '🎂'
            )}
          </Box>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, color: '#FF6B35', fontWeight: 600 }}>
              🎊 ขอให้พรสมหวัง!
            </Typography>
            <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        {blownCandles.length} / {candleCount} เทียน
      </Typography>
    </Paper>
  );
}
