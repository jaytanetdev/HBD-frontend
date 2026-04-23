'use client';

import { useState } from 'react';
import { Box, Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { ImageUploader } from './ImageUploader';
import type { GameType } from '@/lib/types';

const GAME_TYPES = [
  { type: 'BALLOON_POP', label: '🎈 ปาโป่ง', icon: '🎈', needsImage: false },
  { type: 'BIRTHDAY_CAKE', label: '🎂 เค้กวันเกิด', icon: '🎂', needsImage: true },
  { type: 'GIFT_BOX', label: '🎁 กล่องของขวัญ', icon: '🎁', needsImage: true },
  { type: 'SPIN_WHEEL', label: '🎡 วงล้อหมุน', icon: '🎡', needsImage: false },
  { type: 'STICKY_NOTE', label: '📝 โน้ตกระดาษ', icon: '📝', needsImage: false },
  { type: 'REWARD_DISPLAY', label: '🏆 ของรางวัล', icon: '🏆', needsImage: false },
  { type: 'MOOD_RATING', label: '😊 เรทอารมณ์', icon: '😊', needsImage: false },
  { type: 'MEMORY_COLLAGE', label: '🖼️ ภาพความทรงจำ', icon: '🖼️', needsImage: true, multipleImages: true },
  { type: 'DART_GAME', label: '🎯 ปาลูกดอก', icon: '🎯', needsImage: false },
  { type: 'FISHING_GAME', label: '🎣 ตกปลา', icon: '🎣', needsImage: false },
  { type: 'LUCKY_DRAW', label: '🎫 จับฉลาก', icon: '🎫', needsImage: false },
  { type: 'EGG_SHOOTER', label: '🥚 ยิงไข่', icon: '🥚', needsImage: false },
];

interface GameSelectorProps {
  onAddGame: (gameType: GameType, config: any) => void;
}

export function GameSelector({ onAddGame }: GameSelectorProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<GameType | null>(null);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectGame = (gameType: GameType) => {
    setSelectedGameType(gameType);
    setMessage('');
    setImageUrl('');
    setImageUrls([]);
    setConfigDialogOpen(true);
    handleClose();
  };

  const handleAddGameConfirm = () => {
    if (!selectedGameType) return;

    const selectedGame = GAME_TYPES.find((g) => g.type === selectedGameType);
    const needsImage = selectedGame?.needsImage || false;
    const needsMultipleImages = selectedGame?.multipleImages || false;

    // Validation: Check if image is required
    if (needsImage && !needsMultipleImages && !imageUrl.trim()) {
      enqueueSnackbar('กรุณาอัพโหลดรูปภาพสำหรับเกมนี้', { variant: 'error' });
      return;
    }

    // Validation: Check if multiple images are required (at least 1)
    if (needsMultipleImages && imageUrls.length === 0) {
      enqueueSnackbar('กรุณาอัพโหลดรูปภาพอย่างน้อย 1 รูป', { variant: 'error' });
      return;
    }

    const defaultConfigs: Record<string, any> = {
      BALLOON_POP: { message, balloonCount: 8, revealMessage: message || 'สุขสันต์วันเกิด!' },
      BIRTHDAY_CAKE: { message, candleCount: 5, cakeStyle: 'classic', imageUrl: imageUrl || '' },
      GIFT_BOX: { message, giftStyle: 'colorful', imageUrl: imageUrl || '' },
      SPIN_WHEEL: { title: message || 'ลุ้นโชคได้เลย!', options: ['โชคดี 🍀', 'ของขวัญ 🎁', 'ความสุข 😊'] },
      STICKY_NOTE: { message, noteColor: '#FFF9C4', author: 'จากเพื่อนรัก' },
      REWARD_DISPLAY: { message, rewards: ['🎁', '🎂', '🎈', '🎉'] },
      MOOD_RATING: { message, moods: ['😢', '😐', '😊', '😄', '🤩'] },
      MEMORY_COLLAGE: { message, imageUrls: imageUrls.length > 0 ? imageUrls : [] },
      DART_GAME: { message: message || 'ปาลูกดอกให้โดนเป้า!', targetMessage: 'เก่งมาก! คุณโดนเป้าแล้ว!' },
      FISHING_GAME: { message: message || 'ตกปลาให้ได้ครบทุกตัว!', fishCount: 5, successMessage: 'เก่งมาก! ตกได้ครบทุกตัว!' },
      LUCKY_DRAW: { message: message || 'จับฉลากรับของรางวัล!', prizes: ['🎁 ของขวัญพิเศษ', '⭐ รางวัลใหญ่', '💝 ของรางวัล', '🎉 โชคดี', '✨ รางวัลปลอบใจ'] },
      EGG_SHOOTER: { message: message || 'ยิงไข่ให้โดน!', targetScore: 10, successMessage: 'เก่งมาก! ยิงโดนหมดเลย!' },
    };

    onAddGame(selectedGameType, defaultConfigs[selectedGameType] || { message });
    setConfigDialogOpen(false);
    setMessage('');
    setImageUrl('');
    setImageUrls([]);
  };

  const selectedGame = GAME_TYPES.find((g) => g.type === selectedGameType);
  const needsImage = selectedGame?.needsImage || false;
  const needsMultipleImages = selectedGame?.multipleImages || false;

  return (
    <Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        onClick={handleClick}
        sx={{
          borderRadius: 2,
          bgcolor: '#4facfe',
          color: 'white',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
          '&:hover': {
            bgcolor: '#3d8fe6',
            boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
          },
        }}
      >
        เพิ่มเกม
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {GAME_TYPES.map((game) => (
          <MenuItem key={game.type} onClick={() => handleSelectGame(game.type as GameType)}>
            {game.label}
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#4facfe', borderBottom: '3px solid #4facfe' }}>
          {GAME_TYPES.find((g) => g.type === selectedGameType)?.label}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="ข้อความ"
            fullWidth
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="ใส่ข้อความอวยพร..."
            sx={{
              mt: 2,
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': { borderColor: '#4facfe' },
                '&.Mui-focused fieldset': { borderColor: '#4facfe', borderWidth: 2 },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#4facfe', fontWeight: 600 },
            }}
          />

          {needsImage && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                {needsMultipleImages ? (
                  <>
                    อัพโหลดรูปภาพ <span style={{ color: '#f44336' }}>*</span> (อย่างน้อย 1 รูป, สูงสุด 6 รูป)
                  </>
                ) : (
                  <>
                    อัพโหลดรูปภาพ <span style={{ color: '#f44336' }}>*</span>
                  </>
                )}
              </Typography>
              
              {needsMultipleImages ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Box key={index}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontSize: '0.75rem' }}>
                        รูปที่ {index + 1}
                      </Typography>
                      <ImageUploader
                        compact
                        onImageUploaded={(url) => {
                          const newUrls = [...imageUrls];
                          newUrls[index] = url;
                          setImageUrls(newUrls.filter(Boolean));
                        }}
                        currentImageUrl={imageUrls[index]}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <ImageUploader
                  onImageUploaded={setImageUrl}
                  currentImageUrl={imageUrl}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setConfigDialogOpen(false)}
            sx={{
              borderRadius: 2,
              color: '#666',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleAddGameConfirm}
            sx={{
              borderRadius: 2,
              bgcolor: '#4facfe',
              color: 'white',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)',
              '&:hover': {
                bgcolor: '#3d8fe6',
                boxShadow: '0 6px 16px rgba(79, 172, 254, 0.5)',
              },
            }}
          >
            เพิ่ม
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
