'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface PhotoRevealProps {
  config: {
    message: string;
    imageUrl?: string;
    revealStyle?: string;
  };
  onComplete: () => void;
}

export function PhotoReveal({ config, onComplete }: PhotoRevealProps) {
  const { message, imageUrl } = config;
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
        background: 'linear-gradient(135deg, rgba(240,248,255,0.98) 0%, rgba(230,240,255,0.98) 100%)',
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
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📸 คลิกเพื่อเปิดเผยภาพความทรงจำ!
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleReveal}
              variant="contained"
              size="large"
              sx={{
                fontSize: '1.3rem',
                px: 5,
                py: 2.5,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
                },
              }}
            >
              เปิดเผย ✨
            </Button>
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <Box sx={{ py: 2 }}>
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt="Memory"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 350,
                  borderRadius: 3,
                  mb: 3,
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  border: '4px solid white',
                }}
              />
            ) : (
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Typography variant="h1" sx={{ mb: 3, fontSize: '6rem' }}>
                  📷
                </Typography>
              </motion.div>
            )}

            <Typography
              variant="h6"
              sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                color: '#333',
                fontWeight: 500,
                maxWidth: 500,
              }}
            >
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
