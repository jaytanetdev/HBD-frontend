'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button, IconButton } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface MediaPlayerProps {
  config: {
    message: string;
    mediaType?: 'audio' | 'video';
    mediaUrl?: string;
  };
  onComplete: () => void;
}

export function MediaPlayer({ config, onComplete }: MediaPlayerProps) {
  const { message, mediaType = 'audio', mediaUrl } = config;
  const [playing, setPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handlePlay = () => {
    setPlaying(!playing);
    if (!playing && !showMessage) {
      setTimeout(() => {
        setShowMessage(true);
        setTimeout(() => onComplete(), 4000);
      }, 2000);
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        minHeight: 400,
        background: 'linear-gradient(135deg, rgba(240,248,255,0.98) 0%, rgba(224,242,254,0.98) 100%)',
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
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        🎵 {mediaType === 'audio' ? 'เพลงพิเศษสำหรับคุณ' : 'วิดีโอพิเศษสำหรับคุณ'}
      </Typography>

      <motion.div
        animate={{
          scale: playing ? [1, 1.1, 1] : 1,
          rotate: playing ? [0, 5, -5, 0] : 0,
        }}
        transition={{
          duration: 1,
          repeat: playing ? Infinity : 0,
        }}
      >
        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '6rem',
            mb: 3,
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
            border: '5px solid rgba(255,255,255,0.5)',
          }}
        >
          {mediaType === 'audio' ? '🎵' : '🎬'}
        </Box>
      </motion.div>

      {mediaUrl && (
        <Box sx={{ mb: 3, width: '100%', maxWidth: 400 }}>
          {mediaType === 'audio' ? (
            <audio controls style={{ width: '100%' }}>
              <source src={mediaUrl} />
            </audio>
          ) : (
            <video controls style={{ width: '100%', borderRadius: 8 }}>
              <source src={mediaUrl} />
            </video>
          )}
        </Box>
      )}

      {!mediaUrl && (
        <IconButton
          onClick={handlePlay}
          sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            width: 90,
            height: 90,
            mb: 3,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 32px rgba(102, 126, 234, 0.6)',
            },
            transition: 'all 0.3s',
          }}
        >
          {playing ? <Pause sx={{ fontSize: '3rem' }} /> : <PlayArrow sx={{ fontSize: '3rem' }} />}
        </IconButton>
      )}

      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, maxWidth: 500 }}>
              {message}
            </Typography>
          </Box>
        </motion.div>
      )}
    </Paper>
  );
}
