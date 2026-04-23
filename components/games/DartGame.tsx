'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface DartGameProps {
  config: {
    message?: string;
    targetMessage?: string;
  };
  onComplete: () => void;
}

export function DartGame({ config, onComplete }: DartGameProps) {
  const { message = 'ปาลูกดอกให้โดนเป้า! 🎯', targetMessage = 'เก่งมาก! คุณโดนเป้าแล้ว! 🎉' } = config;
  const [darts, setDarts] = useState<{ x: number; y: number; score: number }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const maxDarts = 3;

  const handleThrow = (e: React.MouseEvent<HTMLDivElement>) => {
    if (darts.length >= maxDarts) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // คำนวณคะแนนตามระยะจากจุดศูนย์กลาง
    const centerX = 50;
    const centerY = 50;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const score = distance < 10 ? 10 : distance < 20 ? 7 : distance < 30 ? 5 : 3;

    const newDarts = [...darts, { x, y, score }];
    setDarts(newDarts);

    if (newDarts.length === maxDarts) {
      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => onComplete(), 3000);
      }, 500);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (darts.length >= maxDarts) return;

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;

    // คำนวณคะแนนตามระยะจากจุดศูนย์กลาง
    const centerX = 50;
    const centerY = 50;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const score = distance < 10 ? 10 : distance < 20 ? 7 : distance < 30 ? 5 : 3;

    const newDarts = [...darts, { x, y, score }];
    setDarts(newDarts);

    if (newDarts.length === maxDarts) {
      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => onComplete(), 3000);
      }, 500);
    }
  };

  const totalScore = darts.reduce((sum, dart) => sum + dart.score, 0);

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
          <Box
            onClick={handleThrow}
            onTouchStart={handleTouchStart}
            sx={{
              position: 'relative',
              width: 300,
              height: 300,
              margin: '0 auto',
              cursor: 'crosshair',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #fff 0%, #fff 10%, #f44336 10%, #f44336 20%, #fff 20%, #fff 30%, #2196f3 30%, #2196f3 40%, #fff 40%, #fff 50%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: '5px solid #fff',
              touchAction: 'none',
            }}
          >
            {/* Center bullseye */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#FFD700',
                border: '3px solid #fff',
                zIndex: 1,
              }}
            />

            {/* Darts */}
            {darts.map((dart, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{
                  position: 'absolute',
                  left: `${dart.x}%`,
                  top: `${dart.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Box sx={{ fontSize: '2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                  🎯
                </Box>
              </motion.div>
            ))}
          </Box>

          <Typography variant="body1" sx={{ mt: 3, color: 'white', fontWeight: 600 }}>
            ลูกดอกที่เหลือ: {maxDarts - darts.length} / {maxDarts}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: '#FFD700', fontWeight: 700 }}>
            คะแนน: {totalScore}
          </Typography>
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Box sx={{ py: 4 }}>
            <Typography variant="h1" sx={{ mb: 3, fontSize: '5rem' }}>
              🎊
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              คะแนนรวม: {totalScore} คะแนน!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              }}
            >
              {targetMessage}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
