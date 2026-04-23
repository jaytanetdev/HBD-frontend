'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface SpinWheelProps {
  config: {
    title?: string;
    options?: string[];
  };
  onComplete: () => void;
}

const WHEEL_COLORS = [
  '#FF6B9D', // ชมพู
  '#FEC165', // ส้ม
  '#FFE66D', // เหลือง
  '#4ECDC4', // เขียวอมฟ้า
  '#45B7D1', // ฟ้า
  '#C06CFF', // ม่วง
  '#FF6B6B', // แดง
  '#95E1D3', // เขียวมิ้นท์
];

export function SpinWheel({ config, onComplete }: SpinWheelProps) {
  const { title = 'ลุ้นโชคได้เลย!', options = ['โชคดี 🍀', 'ของขวัญ 🎁', 'ความสุข 😊', 'รอยยิ้ม 😄', 'โชคใหญ่ 💰', 'รางวัล 🎯', 'คะแนน ⭐', 'ของพิเศษ 🎪'] } = config;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    setSpinning(true);
    setResult(null);

    // สุ่มมุมหมุน (หมุนอย่างน้อย 5 รอบ + มุมสุ่ม)
    const randomDegree = 360 * 5 + Math.floor(Math.random() * 360);
    const finalRotation = rotation + randomDegree;
    setRotation(finalRotation);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      setSpinning(false);
      setTimeout(() => onComplete(), 3000);
    }, 4000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,245,235,0.98) 0%, rgba(254,235,235,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '2px solid rgba(255,255,255,0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        🎡 {title}
      </Typography>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="wheel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Wheel SVG */}
            <Box sx={{ position: 'relative', mb: 4 }}>
              <motion.div
                animate={{ rotate: rotation }}
                transition={spinning ? { duration: 4, ease: 'easeOut' } : {}}
                style={{ width: 280, height: 280 }}
              >
                <svg width="280" height="280" viewBox="0 0 280 280" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))' }}>
                  {options.map((option, index) => {
                    const angle = (360 / options.length) * index;
                    const nextAngle = (360 / options.length) * (index + 1);
                    const startAngle = (angle - 90) * (Math.PI / 180);
                    const endAngle = (nextAngle - 90) * (Math.PI / 180);
                    
                    const x1 = 140 + 140 * Math.cos(startAngle);
                    const y1 = 140 + 140 * Math.sin(startAngle);
                    const x2 = 140 + 140 * Math.cos(endAngle);
                    const y2 = 140 + 140 * Math.sin(endAngle);
                    
                    const largeArc = options.length <= 2 ? 1 : 0;
                    
                    return (
                      <path
                        key={index}
                        d={`M 140 140 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={WHEEL_COLORS[index % WHEEL_COLORS.length]}
                        stroke="white"
                        strokeWidth="3"
                      />
                    );
                  })}
                  {/* Center circle */}
                  <circle cx="140" cy="140" r="30" fill="white" stroke="#f093fb" strokeWidth="4" />
                  <text x="140" y="150" textAnchor="middle" fontSize="24" fill="#f093fb" fontWeight="bold">🎯</text>
                </svg>
              </motion.div>
              
              {/* Pointer/Arrow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -15,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '20px solid transparent',
                  borderRight: '20px solid transparent',
                  borderTop: '30px solid #f5576c',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                  zIndex: 10,
                }}
              />
            </Box>

            {/* Spin Button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleSpin}
              disabled={spinning}
              sx={{
                fontSize: '1.2rem',
                px: 4,
                py: 2,
                borderRadius: 50,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                boxShadow: '0 8px 24px rgba(245, 87, 108, 0.4)',
                fontWeight: 700,
                minWidth: 140,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                  boxShadow: '0 12px 32px rgba(245, 87, 108, 0.6)',
                  transform: 'scale(1.05)',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.5) 0%, rgba(245, 87, 108, 0.5) 100%)',
                  color: 'white',
                },
                transition: 'all 0.3s',
              }}
            >
              {spinning ? '⚡ หมุน...' : '🎡 หมุน'}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Box sx={{ py: 4 }}>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
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
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ได้รับ
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {result}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
}
