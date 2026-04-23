'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface StickyNoteProps {
  config: {
    message: string;
    noteColor?: string;
    author?: string;
  };
  onComplete: () => void;
}

export function StickyNote({ config, onComplete }: StickyNoteProps) {
  const { message, noteColor = '#FFF9C4', author = 'จากเพื่อนรัก' } = config;
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => onComplete(), 4000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,253,231,0.98) 0%, rgba(255,248,220,0.98) 100%)',
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
      {!revealed ? (
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
            📝 มีโน้ตฝากถึงคุณ!
          </Typography>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Box
              sx={{
                width: 150,
                height: 150,
                bgcolor: noteColor,
                borderRadius: 1,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                mb: 3,
                transform: 'rotate(-5deg)',
              }}
            >
              📝
            </Box>
          </motion.div>

          <Button
            variant="contained"
            size="large"
            onClick={handleReveal}
            sx={{
              fontSize: '1.3rem',
              px: 5,
              py: 2.5,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
              boxShadow: '0 8px 24px rgba(252, 74, 26, 0.4)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #e6a622 0%, #eb3909 100%)',
                boxShadow: '0 12px 32px rgba(252, 74, 26, 0.6)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            อ่านโน้ต ✉️
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, rotateX: 90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              bgcolor: noteColor,
              p: 4,
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              maxWidth: 500,
              position: 'relative',
              transform: 'rotate(-2deg)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                color: '#333',
                fontFamily: '"Indie Flower", cursive',
                mb: 3,
              }}
            >
              {message}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'right',
                fontStyle: 'italic',
                color: '#666',
                fontFamily: '"Indie Flower", cursive',
              }}
            >
              - {author}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
