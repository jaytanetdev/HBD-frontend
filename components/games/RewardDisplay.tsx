'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface RewardDisplayProps {
  config: {
    message: string;
    rewards?: string[];
  };
  onComplete: () => void;
}

export function RewardDisplay({ config, onComplete }: RewardDisplayProps) {
  const { message, rewards = ['🎁', '🎂', '🎈', '🎉', '🌟'] } = config;
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  const handleNext = () => {
    if (currentRewardIndex < rewards.length - 1) {
      setCurrentRewardIndex(currentRewardIndex + 1);
    } else {
      setShowMessage(true);
      setTimeout(() => onComplete(), 3000);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,243,224,0.98) 0%, rgba(255,236,179,0.98) 100%)',
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
      {!showMessage ? (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🏆 รับของรางวัลจากเรา!
          </Typography>

          <motion.div
            key={currentRewardIndex}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Box sx={{ fontSize: '8rem', mb: 3 }}>
              {rewards[currentRewardIndex]}
            </Box>
          </motion.div>

          <Typography variant="h6" sx={{ mb: 3, color: '#666' }}>
            ของที่ {currentRewardIndex + 1} จาก {rewards.length}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            sx={{
              fontSize: '1.2rem',
              px: 5,
              py: 2,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
              boxShadow: '0 8px 24px rgba(252, 74, 26, 0.4)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #e6a622 0%, #eb3909 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            {currentRewardIndex < rewards.length - 1 ? '➡️ ต่อไป' : '✨ เสร็จแล้ว!'}
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ py: 4 }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
              🎊
            </Typography>
            <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, maxWidth: 500 }}>
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
