'use client';

import { useState } from 'react';
import { Box, Paper, Typography, IconButton, TextField, Collapse, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Image as ImageIcon, MusicNote as MusicNoteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { ImageUploader } from './ImageUploader';
import { MediaUploader } from './MediaUploader';
import type { GameInstance } from '@/lib/types';

const GAME_LABELS: Record<string, string> = {
  BALLOON_POP: '🎈 ปาโป่ง',
  BIRTHDAY_CAKE: '🎂 เค้กวันเกิด',
  GIFT_BOX: '🎁 กล่องของขวัญ',
  SPIN_WHEEL: '🎡 วงล้อหมุน',
  STICKY_NOTE: '📝 โน้ตกระดาษ',
  REWARD_DISPLAY: '🏆 ของรางวัล',
  MOOD_RATING: '😊 เรทอารมณ์',
  MEMORY_COLLAGE: '🖼️ ภาพความทรงจำ',
  DART_GAME: '🎯 ปาลูกดอก',
  FISHING_GAME: '🎣 ตกปลา',
  LUCKY_DRAW: '🎫 จับฉลาก',
  EGG_SHOOTER: '🥚 ยิงไข่',
};

const GAMES_WITH_IMAGE = [
  'MEMORY_COLLAGE',
  'GIFT_BOX',
  'BIRTHDAY_CAKE',
];

const GAMES_WITH_MULTIPLE_IMAGES = ['MEMORY_COLLAGE'];

const GAMES_WITH_MEDIA: string[] = [];

interface SortableGameItemProps {
  id: string;
  game: GameInstance;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
}

export function SortableGameItem({ id, game, index, onDelete, onUpdate }: SortableGameItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempMessage, setTempMessage] = useState(game.config.message || '');

  const needsImage = GAMES_WITH_IMAGE.includes(game.gameType);
  const needsMultipleImages = GAMES_WITH_MULTIPLE_IMAGES.includes(game.gameType);
  const needsMedia = GAMES_WITH_MEDIA.includes(game.gameType);

  const handleSaveMessage = () => {
    onUpdate(game.id, 'message', tempMessage);
    setIsExpanded(false);
  };

  return (
    <Paper
      sx={{
        p: 2.5,
        mb: 2,
        borderRadius: 2,
        bgcolor: 'white',
        border: '2px solid rgba(79, 172, 254, 0.1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(79, 172, 254, 0.2)',
          borderColor: 'rgba(79, 172, 254, 0.3)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '0.9375rem',
            boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)',
          }}
        >
          {index + 1}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#4facfe', mb: 0.5 }}>
            {GAME_LABELS[game.gameType] || game.gameType}
          </Typography>
          {!isExpanded && game.config.message && (
            <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
              {game.config.message.substring(0, 50)}{game.config.message.length > 50 ? '...' : ''}
            </Typography>
          )}
        </Box>

        <IconButton
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            color: '#4facfe',
            '&:hover': { bgcolor: 'rgba(79, 172, 254, 0.1)' },
          }}
        >
          {isExpanded ? <CheckIcon fontSize="small" /> : <EditIcon fontSize="small" />}
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onDelete(game.id)}
          sx={{
            color: '#f44336',
            '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <TextField
            label="ข้อความอวยพร"
            fullWidth
            multiline
            rows={3}
            value={tempMessage}
            onChange={(e) => setTempMessage(e.target.value)}
            onBlur={handleSaveMessage}
            placeholder="ใส่ข้อความอวยพรที่นี่..."
            sx={{
              mb: (needsImage || needsMedia) ? 2 : 0,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
                '&:hover fieldset': { borderColor: '#4facfe' },
                '&.Mui-focused fieldset': { borderColor: '#4facfe', borderWidth: 2 },
              },
            }}
          />

          {needsImage && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ImageIcon sx={{ fontSize: 16 }} />
                รูปภาพ:
              </Typography>
              
              {needsMultipleImages ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Box key={index}>
                      <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 600, color: '#666', fontSize: '0.7rem' }}>
                        รูปที่ {index + 1}
                      </Typography>
                      <ImageUploader
                        compact
                        onImageUploaded={(url) => {
                          const currentUrls = game.config.imageUrls || [];
                          const newUrls = [...currentUrls];
                          newUrls[index] = url;
                          // ⭐ ไม่ filter(Boolean) เพื่อให้ index ตรงเสมอ
                          onUpdate(game.id, 'imageUrls', newUrls);
                        }}
                        currentImageUrl={(game.config.imageUrls || [])[index] || ''}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <ImageUploader
                  onImageUploaded={(url) => onUpdate(game.id, 'imageUrl', url)}
                  currentImageUrl={game.config.imageUrl || ''}
                />
              )}
            </Box>
          )}

          {needsMedia && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MusicNoteIcon sx={{ fontSize: 16 }} />
                ไฟล์เพลง/วิดีโอ:
              </Typography>
              <MediaUploader
                onMediaUploaded={(url) => onUpdate(game.id, 'mediaUrl', url)}
                currentMediaUrl={game.config.mediaUrl || ''}
                mediaType="both"
                compact
              />
            </Box>
          )}

          {/* SPIN_WHEEL Options Editor */}
          {game.gameType === 'SPIN_WHEEL' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                🎡 ตัวเลือกในวงล้อ:
              </Typography>
              {(game.config.options || []).map((option: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(game.config.options || [])];
                      newOptions[index] = e.target.value;
                      onUpdate(game.id, 'options', newOptions);
                    }}
                    placeholder={`ตัวเลือกที่ ${index + 1}`}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        '&:hover fieldset': { borderColor: '#4facfe' },
                        '&.Mui-focused fieldset': { borderColor: '#4facfe' },
                      },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newOptions = (game.config.options || []).filter((_: any, i: number) => i !== index);
                      onUpdate(game.id, 'options', newOptions);
                    }}
                    sx={{
                      color: '#f44336',
                      '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  const newOptions = [...(game.config.options || []), ''];
                  onUpdate(game.id, 'options', newOptions);
                }}
                sx={{
                  color: '#4facfe',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: 'rgba(79, 172, 254, 0.1)' },
                }}
              >
                เพิ่มตัวเลือก
              </Button>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

