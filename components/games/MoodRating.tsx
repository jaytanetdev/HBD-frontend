'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface MoodRatingProps {
  config: {
    message: string;
    moods?: string[];
  };
  onComplete: () => void;
}

export function MoodRating({ config, onComplete }: MoodRatingProps) {
  const { message, moods = ['😢', '😐', '😊', '😄', '🤩'] } = config;
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  const handleSelectMood = (index: number) => {
    setSelectedMood(index);
    setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => onComplete(), 3000);
    }, 500);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,245,250,0.98) 0%, rgba(255,235,245,0.98) 100%)',
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
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            😊 คุณรู้สึกอย่างไรในวันนี้?
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {moods.map((mood, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => handleSelectMood(index)}
                  sx={{
                    fontSize: '3.5rem',
                    minWidth: 90,
                    minHeight: 90,
                    borderRadius: 3,
                    border: selectedMood === index ? '4px solid #f093fb' : '4px solid transparent',
                    bgcolor: selectedMood === index ? 'rgba(240, 147, 251, 0.2)' : 'rgba(255,255,255,0.5)',
                    boxShadow: selectedMood === index ? '0 8px 24px rgba(240, 147, 251, 0.4)' : 'none',
                    '&:hover': {
                      bgcolor: 'rgba(240, 147, 251, 0.15)',
                      transform: 'scale(1.15)',
                      boxShadow: '0 8px 24px rgba(240, 147, 251, 0.3)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  {mood}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            เลือกอีโมจิที่ตรงกับความรู้สึกของคุณ
          </Typography>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ py: 4 }}>
            <Typography variant="h1" sx={{ mb: 3 }}>
              {selectedMood !== null ? moods[selectedMood] : '😊'}
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
