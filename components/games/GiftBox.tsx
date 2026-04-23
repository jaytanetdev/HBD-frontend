'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface GiftBoxProps {
  config: {
    message: string;
    giftStyle?: string;
    imageUrl?: string;
  };
  onComplete: () => void;
}

export function GiftBox({ config, onComplete }: GiftBoxProps) {
  const { message, imageUrl } = config;
  const [isOpened, setIsOpened] = useState(false);

  console.log('🎁 GiftBox Config:', config);
  console.log('🎁 GiftBox imageUrl:', imageUrl);
  console.log('🎁 GiftBox imageUrl type:', typeof imageUrl);
  console.log('🎁 GiftBox imageUrl length:', imageUrl?.length);

  const handleOpenGift = () => {
    setIsOpened(true);
    setTimeout(() => onComplete(), 4000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(255,240,245,0.98) 0%, rgba(240,248,255,0.98) 100%)',
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
      {!isOpened ? (
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
            🎁 คลิกเปิดของขวัญ!
          </Typography>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleOpenGift}
              sx={{
                fontSize: '10rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                '&:hover': { background: 'none' },
              }}
            >
              🎁
            </Button>
          </motion.div>

          <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
            คลิกที่กล่องเพื่อเปิดของขวัญ
          </Typography>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Box sx={{ py: 4 }}>
            {imageUrl ? (
              <Box
                component="img"
                src={imageUrl}
                alt="Gift"
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
                  rotate: [0, 15, -15, 15, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: 2 }}
              >
                <Typography variant="h1" sx={{ mb: 3, fontSize: '6rem' }}>
                  🎉
                </Typography>
              </motion.div>
            )}
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: imageUrl ? 0.3 : 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                เซอร์ไพรส์!
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: imageUrl ? 0.5 : 0.8 }}
            >
              <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, maxWidth: 500, color: '#333', fontWeight: 500 }}>
                {message}
              </Typography>
            </motion.div>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
