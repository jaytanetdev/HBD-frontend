'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon, ArrowBack as ArrowBackIcon, Check as CheckIcon, CloudDone as CloudDoneIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/lib/stores/authStore';
import { cardApi } from '@/lib/api/card';
import { gameApi } from '@/lib/api/game';
import { themeApi } from '@/lib/api/theme';
import { Navbar } from '@/components/layout/Navbar';
import { GameSelector } from '@/components/editor/GameSelector';
import { SortableGameItem } from '@/components/editor/SortableGameItem';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { MediaUploader } from '@/components/editor/MediaUploader';
import type { BirthdayCard, Theme, GameInstance, GameType } from '@/lib/types';

export default function EditCardPage() {
  const router = useRouter();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [card, setCard] = useState<BirthdayCard | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState('');
  const [games, setGames] = useState<GameInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [mounted, setMounted] = useState(false);
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [mounted, params.id, isAuthenticated, router]);

  const loadData = async () => {
    try {
      const [allCards, themesData] = await Promise.all([
        cardApi.getMyCards(),
        themeApi.getThemes(),
      ]);
      
      const cardData = allCards.find((c: any) => c.id === params.id);

      if (cardData) {
        setCard(cardData);
        setRecipientName(cardData.recipientName);
        setSelectedThemeId(cardData.themeId);
        setBackgroundMusicUrl(cardData.backgroundMusicUrl || '');
        setGames(cardData.games);
        
        // Mark as initial load done after a short delay
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 500);
      }
      setThemes(themesData);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-save function - Card data only (no game reorder)
  const autoSaveCard = useCallback(async () => {
    if (!card || isInitialLoad.current || !recipientName.trim()) return;

    try {
      setSaving(true);
      setSaveStatus('saving');
      
      const updateData = {
        recipientName,
        themeId: selectedThemeId,
        backgroundMusicUrl: backgroundMusicUrl || null,
      };
      
      console.log('🔄 Auto-saving card:', { backgroundMusicUrl, updateData });
      
      await cardApi.updateCard(card.id, updateData);

      setSaveStatus('saved');
      console.log('✅ Auto-save successful');
    } catch (error: any) {
      console.error('❌ Auto-save card error:', error);
      setSaveStatus('unsaved');
    } finally {
      setSaving(false);
    }
  }, [card, recipientName, selectedThemeId, backgroundMusicUrl]);

  // Auto-save when recipientName changes (with debounce for typing)
  useEffect(() => {
    if (isInitialLoad.current) return;

    setSaveStatus('unsaved');
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      autoSaveCard(); // ⭐ ใช้ autoSaveCard แทน autoSave
    }, 1000); // Wait 1 second after user stops typing

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [recipientName, autoSaveCard]);

  // Auto-save when backgroundMusicUrl changes (immediate, no debounce)
  useEffect(() => {
    if (isInitialLoad.current) return;

    setSaveStatus('unsaved');
    
    // Clear any pending save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Save immediately for music upload
    autoSaveCard(); // ⭐ ใช้ autoSaveCard แทน autoSave
  }, [backgroundMusicUrl, autoSaveCard]);

  const handleSave = async () => {
    if (!card) return;
    
    // Validation
    if (!recipientName.trim()) {
      enqueueSnackbar('กรุณากรอกชื่อคนที่จะอวยพร', { variant: 'error' });
      return;
    }

    try {
      setSaving(true);
      await cardApi.updateCard(card.id, {
        recipientName,
        themeId: selectedThemeId,
        backgroundMusicUrl: backgroundMusicUrl || null,
      });
      
      // Only reorder games if there are any
      if (games.length > 0) {
        await gameApi.reorderGames({
          games: games.map((g, idx) => ({ id: g.id, order: idx + 1 })),
        });
      }

      enqueueSnackbar('บันทึกสำเร็จ!', { variant: 'success' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'บันทึกไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGame = async (gameType: GameType, config: any) => {
    if (!card) return;
    try {
      const newGame = await gameApi.addGame({
        cardId: card.id,
        gameType,
        order: games.length + 1,
        config,
      });
      setGames([...games, newGame]);
      enqueueSnackbar('เพิ่มเกมสำเร็จ!', { variant: 'success' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'เพิ่มเกมไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('ต้องการลบเกมนี้?')) return;
    try {
      await gameApi.deleteGame(gameId);
      setGames(games.filter((g) => g.id !== gameId));
      enqueueSnackbar('ลบเกมสำเร็จ', { variant: 'success' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'ลบเกมไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleUpdateGame = async (gameId: string, field: string, value: any) => {
    const updatedGames = games.map((g) => {
      if (g.id === gameId) {
        return {
          ...g,
          config: {
            ...g.config,
            [field]: value,
          },
        };
      }
      return g;
    });
    setGames(updatedGames);

    // Auto-save game update
    setSaveStatus('unsaved');
    
    try {
      const game = updatedGames.find((g) => g.id === gameId);
      if (game) {
        await gameApi.updateGame(gameId, { config: game.config });
        setSaveStatus('saved');
      }
    } catch (error: any) {
      console.error('Game update error:', error);
      setSaveStatus('unsaved');
    }
  };

  const handlePublish = () => {
    if (card) {
      const link = `${window.location.origin}/c/${card.slug}`;
      navigator.clipboard.writeText(link);
      enqueueSnackbar('คัดลอกลิงก์แล้ว! แชร์ให้เพื่อนได้เลย 🎉', { variant: 'success' });
    }
  };

  if (!mounted || loading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          }}
        >
          <Typography>กำลังโหลด...</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: -150,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -120,
            right: '20%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '40%',
            right: -80,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: '30%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Header with Save/Publish buttons - Sticky */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 100,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            py: 2,
            px: { xs: 2, sm: 3, md: 4 },
            mb: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: '1400px',
              mx: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <IconButton
                onClick={() => router.push('/dashboard')}
                sx={{
                  color: '#1e3a8a',
                  '&:hover': { bgcolor: 'rgba(30, 58, 138, 0.08)' },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#1e3a8a',
                  letterSpacing: -0.5,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                แก้ไขการ์ด
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#666', ml: 6, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              จัดการเนื้อหาและเกมในการ์ด
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Save Status Indicator */}
            <Chip
              icon={
                saveStatus === 'saved' ? <CloudDoneIcon /> :
                saveStatus === 'saving' ? <CloudDoneIcon /> :
                <CloudDoneIcon />
              }
              label={
                saveStatus === 'saved' ? 'บันทึกแล้ว' :
                saveStatus === 'saving' ? 'กำลังบันทึก...' :
                'มีการเปลี่ยนแปลง'
              }
              sx={{
                bgcolor: 
                  saveStatus === 'saved' ? 'rgba(76, 175, 80, 0.1)' :
                  saveStatus === 'saving' ? 'rgba(33, 150, 243, 0.1)' :
                  'rgba(255, 152, 0, 0.1)',
                color:
                  saveStatus === 'saved' ? '#4CAF50' :
                  saveStatus === 'saving' ? '#2196F3' :
                  '#FF9800',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '& .MuiChip-icon': {
                  color:
                    saveStatus === 'saved' ? '#4CAF50' :
                    saveStatus === 'saving' ? '#2196F3' :
                    '#FF9800',
                },
              }}
            />
            
            <Button
              variant="contained"
              onClick={handlePublish}
              sx={{
                bgcolor: '#1e3a8a',
                color: 'white',
                textTransform: 'none',
                fontWeight: 800,
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)',
                '&:hover': {
                  bgcolor: '#1e40af',
                  boxShadow: '0 6px 16px rgba(30, 58, 138, 0.6)',
                },
              }}
            >
                🎉 เผยแพร่ & คัดลอกลิงก์
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Main Content - Full Width */}
        <Box sx={{ maxWidth: '1400px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, flex: 1 }}>
          {/* Basic Info Section - Full Width */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1e3a8a', mb: 3, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
              ข้อมูลพื้นฐาน
              <Typography component="span" variant="caption" sx={{ ml: 2, color: '#666', fontWeight: 400 }}>
                (บันทึกอัตโนมัติ)
              </Typography>
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
              error={!recipientName.trim()}
              helperText={!recipientName.trim() ? 'กรุณากรอกชื่อคนที่จะอวยพร' : ''}
              placeholder="ใส่ชื่อคนที่จะอวยพร..."
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#1e3a8a' },
                  '&.Mui-focused fieldset': { borderColor: '#1e3a8a', borderWidth: 2 },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1e3a8a', fontWeight: 700 },
                '& .MuiInputLabel-asterisk': { color: '#f44336' },
              }}
            />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
          </Paper>

          {/* Game Selector - Full Width */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1e3a8a', mb: 3, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
              เพิ่มเกม
            </Typography>
            <GameSelector onAddGame={handleAddGame} />
          </Paper>

          {/* Games List - Full Width */}
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800, color: '#1e3a8a', mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
              เกมทั้งหมด ({games.length})
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 3, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              คลิกเพื่อแก้ไขข้อมูล
            </Typography>

            <Box>
              {games.map((game, index) => (
                <SortableGameItem
                  key={game.id}
                  id={game.id}
                  game={game}
                  index={index}
                  onDelete={handleDeleteGame}
                  onUpdate={handleUpdateGame}
                />
              ))}

              {games.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    bgcolor: 'rgba(30, 58, 138, 0.05)',
                    borderRadius: 3,
                    border: '2px dashed rgba(30, 58, 138, 0.2)',
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                    🎮
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e3a8a', mb: 0.5, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                    ยังไม่มีเกม
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    คลิกเพิ่มเกมด้านบน
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
