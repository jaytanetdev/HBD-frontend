'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface MemoryCollageProps {
  config: {
    message: string;
    imageUrls?: string[];
  };
  onComplete: () => void;
}

export function MemoryCollage({ config, onComplete }: MemoryCollageProps) {
  const { message, imageUrls = [] } = config;
  const [revealed, setRevealed] = useState(false);

  const defaultImages = ['🖼️', '📷', '🎨', '🌅', '🌺', '🎭'];
  
  // Filter out empty strings and null/undefined values
  const validImageUrls = imageUrls.filter((url) => url && url.trim().length > 0);
  const displayItems = validImageUrls.length > 0 ? validImageUrls.slice(0, 6) : defaultImages;

  console.log('🖼️ MemoryCollage config:', { 
    rawImageUrls: imageUrls, 
    validImageUrls, 
    displayItems 
  });

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => onComplete(), 4000);
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(245,245,255,0.98) 0%, rgba(235,240,255,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: 6,
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        border: '2px solid rgba(255,255,255,0.5)',
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
            🖼️ ความทรงจำดีๆ ที่มีร่วมกัน
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mb: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {displayItems.slice(0, 6).map((imageItem, index) => (
              <Box key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      paddingTop: '100%',
                      position: 'relative',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      bgcolor: '#f0f0f0',
                    }}
                  >
                    {typeof imageItem === 'string' && imageItem.startsWith('http') ? (
                      <Box
                        component="img"
                        src={imageItem}
                        alt={`Memory ${index + 1}`}
                        onError={(e) => {
                          console.error('❌ Failed to load image:', imageItem);
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => console.log('✅ Image loaded:', imageItem)}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#f5f5f5',
                          fontSize: '3rem',
                        }}
                      >
                        {imageItem}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleReveal}
            sx={{
              fontSize: '1.2rem',
              px: 5,
              py: 2,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            ดูข้อความ 💌
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
              💝
            </Typography>
            <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, maxWidth: 500, mx: 'auto' }}>
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
