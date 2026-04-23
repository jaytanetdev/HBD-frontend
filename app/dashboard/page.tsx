'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  AutoAwesome as AutoAwesomeIcon,
  Cake as CakeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/lib/stores/authStore';
import { cardApi } from '@/lib/api/card';
import { templateApi } from '@/lib/api/template';
import { Navbar } from '@/components/layout/Navbar';
import type { BirthdayCard } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [cards, setCards] = useState<BirthdayCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [randomDialogOpen, setRandomDialogOpen] = useState(false);
  const [randomName, setRandomName] = useState('');
  const [creatingRandom, setCreatingRandom] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Floating particles animation
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    emoji: ['🎈', '🎉', '🎊', '🎂', '✨', '🎁'][i % 6],
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadCards();
  }, [mounted, isAuthenticated, router]);

  const loadCards = async () => {
    try {
      const data = await cardApi.getMyCards();
      setCards(data);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'ไม่สามารถโหลดการ์ดได้ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบการ์ดนี้?')) return;
    try {
      await cardApi.deleteCard(id);
      enqueueSnackbar('ลบการ์ดสำเร็จ', { variant: 'success' });
      loadCards();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'ลบการ์ดไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await cardApi.duplicateCard(id);
      enqueueSnackbar('คัดลอกการ์ดสำเร็จ', { variant: 'success' });
      loadCards();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'คัดลอกการ์ดไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(link);
    enqueueSnackbar('คัดลอกลิงก์แล้ว', { variant: 'success' });
  };

  const handleCreateRandom = async () => {
    if (!randomName.trim()) {
      enqueueSnackbar('กรุณากรอกชื่อคนที่จะอวยพร', { variant: 'error' });
      return;
    }
    try {
      setCreatingRandom(true);
      const card = await templateApi.generateRandomCard(randomName);
      enqueueSnackbar('สร้างการ์ดสำเร็จ! 🎉', { variant: 'success' });
      setRandomDialogOpen(false);
      setRandomName('');
      router.push(`/edit/${card.id}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'สร้างการ์ดไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setCreatingRandom(false);
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
            background: 'linear-gradient(135deg, #0d47a1 0%, #1e88e5 100%)',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <CakeIcon sx={{ fontSize: '4rem', color: 'white' }} />
          </motion.div>
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
          background: 'linear-gradient(135deg, #0d47a1 0%, #1e88e5 100%)',
          py: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ 
              y: '-100vh', 
              opacity: [0, 1, 1, 0],
              x: [0, 50, -50, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              fontSize: '2rem',
              pointerEvents: 'none',
            }}
          >
            {particle.emoji}
          </motion.div>
        ))}

        {/* Background decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2, px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1800px', mx: 'auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              mb: { xs: 3, sm: 4 },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box sx={{ mb: { xs: 0, sm: 0 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 0.5,
                  letterSpacing: -0.5,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                }}
              >
                การ์ดของฉัน
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' } }}>
                จัดการการ์ดอวยพรวันเกิดของคุณ
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeIcon sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' } }} />}
                onClick={() => setRandomDialogOpen(true)}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  borderWidth: 2,
                  borderRadius: 3,
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  backdropFilter: 'blur(10px)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  flex: { xs: 1, sm: 0 },
                  minWidth: { sm: '140px' },
                  maxWidth: { sm: '180px' },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                สุ่มการ์ด
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/create')}
                sx={{
                  bgcolor: 'white',
                  color: '#4facfe',
                  textTransform: 'none',
                  fontWeight: 800,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                  borderRadius: 3,
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.3)',
                  flex: { xs: 1, sm: 0 },
                  minWidth: { sm: '160px' },
                  maxWidth: { sm: '200px' },
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: 'white',
                    boxShadow: '0 12px 32px rgba(255, 255, 255, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                + สร้างการ์ดใหม่
              </Button>
            </Box>
          </Box>

            {cards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: { xs: 6, sm: 8, md: 10 },
                  px: { xs: 3, sm: 4 },
                  bgcolor: 'white',
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '3px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #4facfe, #00f2fe)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' }, mb: { xs: 2, sm: 3 } }}>
                    🎂
                  </Typography>
                </motion.div>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#4facfe', mb: 1, fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' } }}>
                  ยังไม่มีการ์ด
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: { xs: 3, sm: 4 }, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                  เริ่มสร้างการ์ดอวยพรวันเกิดแรกของคุณ
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => router.push('/create')}
                  sx={{
                    px: { xs: 2.5, sm: 3.5, md: 4 },
                    py: { xs: 1.2, sm: 1.5 },
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
                    fontWeight: 700,
                    fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.05rem' },
                    maxWidth: '250px',
                    mx: 'auto',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3d8fe6 0%, #00d9e6 100%)',
                      boxShadow: '0 12px 32px rgba(79, 172, 254, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  สร้างเลย 🎉
                </Button>
              </Box>
            </motion.div>
          ) : (
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3, md: 4 },
              justifyContent: { xs: 'center', sm: 'flex-start', md: 'flex-start' },
              maxWidth: '1400px',
              mx: 'auto',
            }}>
              {cards.map((card, index) => (
                <Box 
                  key={card.id}
                  sx={{
                    width: { 
                      xs: '100%', 
                      sm: 'calc(50% - 12px)', 
                      md: 'calc(33.333% - 21.333px)',
                      lg: 'calc(33.333% - 21.333px)'
                    },
                    maxWidth: '380px',
                    minWidth: { sm: '280px' },
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card
                      onClick={() => router.push(`/edit/${card.id}`)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 4,
                        overflow: 'visible',
                        bgcolor: 'white',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        position: 'relative',
                        border: '1px solid rgba(0,0,0,0.08)',
                        '&:hover': {
                          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 6,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '16px 16px 0 0',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          pt: { xs: 3, sm: 4 },
                          pb: 2,
                          px: { xs: 2, sm: 3 },
                          textAlign: 'center',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 60, sm: 70, md: 80 },
                            height: { xs: 60, sm: 70, md: 80 },
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 2,
                            boxShadow: '0 8px 24px rgba(79, 172, 254, 0.4)',
                          }}
                        >
                          <CakeIcon sx={{ fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' }, color: 'white' }} />
                        </Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: '#333',
                            mb: 0.5,
                            letterSpacing: -0.5,
                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
                          }}
                        >
                          {card.recipientName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999', fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' } }}>
                          {card.theme.name}
                        </Typography>
                      </Box>
                      
                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, pt: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Chip
                            label={`${card.games.length} เกม`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(102, 126, 234, 0.1)',
                              color: '#667eea',
                              fontWeight: 700,
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              height: { xs: 24, sm: 28 },
                              borderRadius: 2,
                              border: '1px solid rgba(102, 126, 234, 0.2)',
                            }}
                          />
                          <Chip
                            label={`${card.viewCount} ครั้ง`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(118, 75, 162, 0.1)',
                              color: '#764ba2',
                              fontWeight: 700,
                              fontSize: { xs: '0.65rem', sm: '0.75rem' },
                              height: { xs: 24, sm: 28 },
                              borderRadius: 2,
                              border: '1px solid rgba(118, 75, 162, 0.2)',
                            }}
                          />
                        </Box>
                      </CardContent>
                      
                      <CardActions
                        sx={{
                          justifyContent: 'center',
                          px: { xs: 1.5, sm: 2 },
                          pb: { xs: 2, sm: 3 },
                          pt: 0,
                          gap: { xs: 0.75, sm: 1 },
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLink(card.slug);
                          }}
                          sx={{
                            color: '#4facfe',
                            bgcolor: 'rgba(79, 172, 254, 0.1)',
                            padding: { xs: '6px', sm: '8px' },
                            '&:hover': { 
                              bgcolor: 'rgba(79, 172, 254, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <ShareIcon fontSize="small" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(card.id);
                          }}
                          sx={{
                            color: '#f44336',
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            padding: { xs: '6px', sm: '8px' },
                            '&:hover': { 
                              bgcolor: 'rgba(244, 67, 54, 0.2)',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <DeleteIcon fontSize="small" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          )}

          <Dialog
            open={randomDialogOpen}
            onClose={() => setRandomDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            slotProps={{
              paper: {
                sx: {
                  borderRadius: 3,
                  p: 1,
                },
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 600, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              สร้างการ์ดแบบสุ่ม ✨
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                กรอกชื่อคนที่จะอวยพร ระบบจะสุ่มเกมและธีมให้อัตโนมัติ
              </Typography>
              <TextField
                label={
                  <span>
                    ชื่อคนที่จะอวยพร <span style={{ color: '#f44336' }}>*</span>
                  </span>
                }
                fullWidth
                required
                value={randomName}
                onChange={(e) => setRandomName(e.target.value)}
                autoFocus
                error={!randomName.trim()}
                helperText={!randomName.trim() ? 'กรุณากรอกชื่อคนที่จะอวยพร' : ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                  '& .MuiInputLabel-asterisk': { color: '#f44336' },
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={() => setRandomDialogOpen(false)}
                sx={{ borderRadius: 2 }}
              >
                ยกเลิก
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateRandom}
                disabled={creatingRandom || !randomName.trim()}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3d8fe6 0%, #00d9e6 100%)',
                  },
                }}
              >
                {creatingRandom ? 'กำลังสร้าง...' : 'สร้างเลย'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}
