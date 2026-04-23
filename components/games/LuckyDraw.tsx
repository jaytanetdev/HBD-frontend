'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface LuckyDrawProps {
  config: {
    message?: string;
    prizes?: string[];
  };
  onComplete: () => void;
}

export function LuckyDraw({ config, onComplete }: LuckyDrawProps) {
  const {
    message = 'จับฉลากรับของรางวัล! 🎁',
    prizes = ['🎁 ของขวัญพิเศษ', '⭐ รางวัลใหญ่', '💝 ของรางวัล', '🎉 โชคดี', '✨ รางวัลปลอบใจ']
  } = config;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleDraw = () => {
    setIsShaking(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      setSelectedIndex(randomIndex);
      setIsShaking(false);
      setShowResult(true);
      setTimeout(() => onComplete(), 3000);
    }, 2000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 500,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.2)',
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
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        {message}
      </Typography>

      {!showResult ? (
        <Box>
          <motion.div
            animate={isShaking ? {
              rotate: [-5, 5, -5, 5, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.5, repeat: isShaking ? 4 : 0 }}
          >
            <Box
              sx={{
                width: 200,
                height: 280,
                margin: '0 auto',
                bgcolor: '#FFD700',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '5px solid #fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography variant="h1" sx={{ fontSize: '5rem', mb: 2 }}>
                🎫
              </Typography>
              <Typography variant="h6" sx={{ color: '#f5576c', fontWeight: 700 }}>
                กล่องฉลาก
              </Typography>
            </Box>
          </motion.div>

          <Button
            variant="contained"
            size="large"
            onClick={handleDraw}
            disabled={isShaking}
            sx={{
              mt: 4,
              px: 4,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
              borderRadius: 3,
              bgcolor: 'white',
              color: '#f5576c',
              boxShadow: '0 8px 24px rgba(255,255,255,0.4)',
              '&:hover': {
                bgcolor: 'white',
                boxShadow: '0 12px 32px rgba(255,255,255,0.6)',
                transform: 'scale(1.05)',
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(255,255,255,0.5)',
                color: '#f5576c',
              },
              transition: 'all 0.3s',
            }}
          >
            {isShaking ? '🔄 กำลังจับ...' : '🎲 จับฉลาก'}
          </Button>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Box sx={{ py: 4 }}>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                repeat: 2,
              }}
            >
              <Typography variant="h1" sx={{ mb: 3, fontSize: '6rem' }}>
                🎊
              </Typography>
            </motion.div>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              คุณได้รับ
            </Typography>
            <Typography
              variant="h3"
              sx={{
                color: '#FFD700',
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {selectedIndex !== null ? prizes[selectedIndex] : ''}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
