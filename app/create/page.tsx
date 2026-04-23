'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, TextField, Typography, Paper, IconButton, Chip } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Image as ImageIcon, MusicNote as MusicNoteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { cardApi } from '@/lib/api/card';
import { themeApi } from '@/lib/api/theme';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { MediaUploader } from '@/components/editor/MediaUploader';
import type { GameType } from '@/lib/types';

const GAME_TYPES = [
  { type: 'BALLOON_POP', label: '🎈 ปาโป่ง', needsImage: false },
  { type: 'BIRTHDAY_CAKE', label: '🎂 เค้กวันเกิด', needsImage: false },
  { type: 'GIFT_BOX', label: '🎁 กล่องของขวัญ', needsImage: false },
  { type: 'SPIN_WHEEL', label: '🎡 วงล้อหมุน', needsImage: false },
  { type: 'STICKY_NOTE', label: '📝 โน้ตกระดาษ', needsImage: false },
  { type: 'REWARD_DISPLAY', label: '🏆 ของรางวัล', needsImage: false },
  { type: 'MOOD_RATING', label: '😊 เรทอารมณ์', needsImage: false },
  { type: 'MEMORY_COLLAGE', label: '🖼️ ภาพความทรงจำ', needsImage: true, multipleImages: true },
  { type: 'DART_GAME', label: '🎯 ปาลูกดอก', needsImage: false },
  { type: 'FISHING_GAME', label: '🎣 ตกปลา', needsImage: false },
  { type: 'LUCKY_DRAW', label: '🎫 จับฉลาก', needsImage: false },
  { type: 'EGG_SHOOTER', label: '🥚 ยิงไข่', needsImage: false },
];

interface GameItem {
  id: string;
  type: GameType;
  message: string;
  imageUrl?: string;
  imageUrls?: string[];
}

export default function CreatePage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [recipientName, setRecipientName] = useState('');
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState('');
  const [games, setGames] = useState<GameItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);

  const handleAddGame = (gameType: GameType) => {
    const newGame: GameItem = {
      id: `temp-${Date.now()}`,
      type: gameType,
      message: '',
      imageUrl: '',
      imageUrls: [],
    };
    setGames([...games, newGame]);
    setShowGameSelector(false);
  };

  const handleUpdateGame = (id: string, field: string, value: any) => {
    setGames(games.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter((g) => g.id !== id));
  };

  const handleAddImageToGame = (gameId: string, imageUrl: string) => {
    setGames(
      games.map((g) => {
        if (g.id === gameId) {
          const gameType = GAME_TYPES.find((t) => t.type === g.type);
          if (gameType?.multipleImages) {
            return { ...g, imageUrls: [...(g.imageUrls || []), imageUrl] };
          } else {
            return { ...g, imageUrl };
          }
        }
        return g;
      })
    );
  };

  const handleRemoveImage = (gameId: string, imageIndex?: number) => {
    setGames(
      games.map((g) => {
        if (g.id === gameId) {
          if (imageIndex !== undefined && g.imageUrls) {
            return { ...g, imageUrls: g.imageUrls.filter((_, i) => i !== imageIndex) };
          } else {
            return { ...g, imageUrl: '' };
          }
        }
        return g;
      })
    );
  };

  const onSubmit = async () => {
    if (!recipientName.trim()) {
      enqueueSnackbar('กรุณากรอกชื่อคนที่จะอวยพร', { variant: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const themes = await themeApi.getThemes();
      const selectedTheme = themes[0];

      const card = await cardApi.createCard({
        recipientName: recipientName.trim(),
        themeId: selectedTheme.id,
        backgroundMusicUrl: backgroundMusicUrl || undefined,
      });

      enqueueSnackbar('สร้างการ์ดสำเร็จ!', { variant: 'success' });
      router.push(`/edit/${card.id}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'สร้างการ์ดไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getGameInfo = (type: GameType) => GAME_TYPES.find((g) => g.type === type);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 100%)',
        py: 6,
        position: 'relative',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={24}
          sx={{
            p: 5,
            borderRadius: 4,
            bgcolor: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: 'linear-gradient(90deg, #FFD54F 0%, #FFC107 100%)',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1565C0',
              mb: 1,
              letterSpacing: -0.5,
            }}
          >
            สร้างการ์ดใหม่ ✨
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
            เริ่มต้นสร้างการ์ดอวยพรวันเกิดสุดพิเศษ
          </Typography>

          <TextField
            label={
              <span>
                ชื่อคนที่จะอวยพร <span style={{ color: '#f44336' }}>*</span>
              </span>
            }
            fullWidth
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="เช่น Moo Pung"
            error={!recipientName.trim()}
            helperText={!recipientName.trim() ? 'กรุณากรอกชื่อคนที่จะอวยพร' : ''}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#1565C0' },
                '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#1565C0', fontWeight: 600 },
              '& .MuiInputLabel-asterisk': { color: '#f44336' },
            }}
          />

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#1565C0', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              🎵 เพลงพื้นหลัง (ไม่บังคับ)
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
              อัปโหลดเพลงที่จะเล่นเมื่อเปิดการ์ด
            </Typography>
            <MediaUploader
              onMediaUploaded={(url) => setBackgroundMusicUrl(url)}
              currentMediaUrl={backgroundMusicUrl}
              mediaType="audio"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1565C0' }}>
                เกมอวยพร ({games.length})
              </Typography>
              <Button
                variant={showGameSelector ? 'outlined' : 'contained'}
                startIcon={<AddIcon />}
                onClick={() => setShowGameSelector(!showGameSelector)}
                sx={{
                  bgcolor: showGameSelector ? 'transparent' : '#FFD54F',
                  color: '#1565C0',
                  borderColor: '#FFD54F',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: showGameSelector ? 'rgba(255,213,79,0.1)' : '#FFC107',
                  },
                }}
              >
                {showGameSelector ? 'ปิด' : 'เพิ่มเกม'}
              </Button>
            </Box>

            {showGameSelector && (
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  bgcolor: 'rgba(21, 101, 192, 0.05)',
                  border: '2px dashed rgba(21, 101, 192, 0.2)',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: '#666' }}>
                  เลือกเกมที่ต้องการ:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {GAME_TYPES.map((game) => (
                    <Chip
                      key={game.type}
                      label={game.label}
                      onClick={() => handleAddGame(game.type as GameType)}
                      sx={{
                        bgcolor: 'white',
                        border: '2px solid #FFD54F',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#FFD54F',
                          color: '#1565C0',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            )}

            {games.length === 0 && !showGameSelector && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  bgcolor: '#f5f5f5',
                  borderRadius: 2,
                  border: '2px dashed #e0e0e0',
                }}
              >
                <Typography variant="h5" sx={{ mb: 1 }}>
                  🎮
                </Typography>
                <Typography variant="body1" sx={{ color: '#999' }}>
                  ยังไม่มีเกม คลิก "เพิ่มเกม" เพื่อเริ่มต้น
                </Typography>
              </Box>
            )}

            {games.map((game, index) => {
              const gameInfo = getGameInfo(game.type);
              return (
                <Paper
                  key={game.id}
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 2,
                    border: '2px solid rgba(21, 101, 192, 0.2)',
                    position: 'relative',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          bgcolor: '#1565C0',
                          color: 'white',
                          fontWeight: 700,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565C0' }}>
                        {gameInfo?.label}
                      </Typography>
                    </Box>
                    <IconButton onClick={() => handleDeleteGame(game.id)} sx={{ color: '#f44336' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <TextField
                    label="ข้อความอวยพร"
                    fullWidth
                    multiline
                    rows={2}
                    value={game.message}
                    onChange={(e) => handleUpdateGame(game.id, 'message', e.target.value)}
                    placeholder="ใส่ข้อความอวยพรที่นี่..."
                    sx={{
                      mb: gameInfo?.needsImage ? 2 : 0,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                      },
                    }}
                  />

                  {gameInfo?.needsImage && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                        <ImageIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        รูปภาพ{gameInfo.multipleImages ? ' (สามารถเพิ่มได้หลายรูป)' : ''}:
                      </Typography>
                      
                      {gameInfo.multipleImages ? (
                        <Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                            {game.imageUrls?.map((url, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  position: 'relative',
                                  width: 120,
                                  height: 120,
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  border: '2px solid #e0e0e0',
                                }}
                              >
                                <img
                                  src={url}
                                  alt={`Memory ${idx + 1}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <IconButton
                                  onClick={() => handleRemoveImage(game.id, idx)}
                                  sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    bgcolor: 'rgba(244,67,54,0.9)',
                                    color: 'white',
                                    padding: 0.5,
                                    '&:hover': { bgcolor: '#f44336' },
                                  }}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                          <ImageUploader
                            onImageUploaded={(url) => handleAddImageToGame(game.id, url)}
                            currentImageUrl=""
                          />
                        </Box>
                      ) : (
                        <ImageUploader
                          onImageUploaded={(url) => handleUpdateGame(game.id, 'imageUrl', url)}
                          currentImageUrl={game.imageUrl || ''}
                        />
                      )}
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/dashboard')}
              sx={{
                borderColor: '#e0e0e0',
                color: '#666',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#1565C0',
                },
              }}
            >
              ยกเลิก
            </Button>
            <Button
              onClick={onSubmit}
              variant="contained"
              disabled={isLoading || !recipientName.trim()}
              sx={{
                bgcolor: '#FFD54F',
                color: '#1565C0',
                fontWeight: 700,
                px: 4,
                boxShadow: '0 4px 12px rgba(255, 213, 79, 0.4)',
                '&:hover': {
                  bgcolor: '#FFC107',
                  boxShadow: '0 6px 16px rgba(255, 193, 7, 0.5)',
                },
              }}
            >
              {isLoading ? 'กำลังสร้าง...' : 'สร้างการ์ด'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
