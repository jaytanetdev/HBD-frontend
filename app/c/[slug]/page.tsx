'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { cardApi } from '@/lib/api/card';
import { BalloonPop } from '@/components/games/BalloonPop';
import { BirthdayCake } from '@/components/games/BirthdayCake';
import { GiftBox } from '@/components/games/GiftBox';
import { SpinWheel } from '@/components/games/SpinWheel';
import { StickyNote } from '@/components/games/StickyNote';
import { RewardDisplay } from '@/components/games/RewardDisplay';
import { MoodRating } from '@/components/games/MoodRating';
import { MemoryCollage } from '@/components/games/MemoryCollage';
import { DartGame } from '@/components/games/DartGame';
import { FishingGame } from '@/components/games/FishingGame';
import { LuckyDraw } from '@/components/games/LuckyDraw';
import { EggShooter } from '@/components/games/EggShooter';
import type { BirthdayCard, GameInstance } from '@/lib/types';

const GameComponents: Record<string, any> = {
  BALLOON_POP: BalloonPop,
  BIRTHDAY_CAKE: BirthdayCake,
  GIFT_BOX: GiftBox,
  SPIN_WHEEL: SpinWheel,
  STICKY_NOTE: StickyNote,
  REWARD_DISPLAY: RewardDisplay,
  MOOD_RATING: MoodRating,
  MEMORY_COLLAGE: MemoryCollage,
  DART_GAME: DartGame,
  FISHING_GAME: FishingGame,
  LUCKY_DRAW: LuckyDraw,
  EGG_SHOOTER: EggShooter,
};

// Floating particles component
function FloatingParticles() {
  const particles = ['🎈', '🎉', '🎊', '🎁', '⭐', '✨', '💝', '🎂', '🌟', '💫'];
  
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            fontSize: '2rem',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          {particles[Math.floor(Math.random() * particles.length)]}
        </motion.div>
      ))}
    </Box>
  );
}

export default function CardViewPage() {
  const params = useParams();
  const { width, height } = useWindowSize();
  const [card, setCard] = useState<BirthdayCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCard();
  }, [params.slug]);

  // Auto play music after user interaction
  useEffect(() => {
    if (!mounted || !card?.backgroundMusicUrl) return;

    const playMusic = () => {
      const audioElement = document.getElementById('background-music') as HTMLAudioElement;
      if (audioElement && !musicPlaying) {
        audioElement.play()
          .then(() => {
            console.log('🎵 Music playing');
            setMusicPlaying(true);
          })
          .catch((error) => {
            console.log('🔇 Autoplay prevented, waiting for user interaction:', error);
          });
      }
    };

    // Try to play immediately
    playMusic();

    // Add click listener to play music on first interaction
    const handleInteraction = () => {
      playMusic();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [mounted, card, musicPlaying]);

  const loadCard = async () => {
    try {
      const data = await cardApi.getCardBySlug(params.slug as string);
      console.log('📦 Card Data:', data);
      console.log('🎮 Games:', data.games);
      data.games.forEach((game, idx) => {
        console.log(`Game ${idx + 1} (${game.gameType}):`, game.config);
      });
      setCard(data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      setTimeout(() => setShowIntro(false), 3000);
    } catch (error) {
      console.error('Failed to load card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameComplete = () => {
    if (card && currentGameIndex < card.games.length - 1) {
      setTimeout(() => {
        setCurrentGameIndex(currentGameIndex + 1);
      }, 1000);
    } else {
      setShowConfetti(true);
    }
  };

  if (!mounted || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  if (!card) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" sx={{ color: 'white' }}>
            ไม่พบการ์ดนี้
          </Typography>
        </Box>
      </Container>
    );
  }

  const currentGame = card.games[currentGameIndex];
  const GameComponent = currentGame ? GameComponents[currentGame.gameType] : null;
  
  console.log('🎯 Current Game Index:', currentGameIndex);
  console.log('🎯 Current Game:', currentGame);
  console.log('🎯 Game Component:', GameComponent ? 'Found' : 'Not Found');
  if (currentGame) {
    console.log('🎯 Game Config:', currentGame.config);
    console.log('🎯 Has imageUrl:', !!currentGame.config?.imageUrl);
    console.log('🎯 Has imageUrls:', !!currentGame.config?.imageUrls);
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: card.theme.gradient,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {mounted && showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      <FloatingParticles />

      {/* Background Music */}
      {card.backgroundMusicUrl && (
        <audio
          id="background-music"
          loop
          preload="auto"
          style={{ display: 'none' }}
        >
          <source src={card.backgroundMusicUrl} type="audio/mpeg" />
          <source src={card.backgroundMusicUrl} type="audio/mp3" />
          <source src={card.backgroundMusicUrl} type="audio/wav" />
          <source src={card.backgroundMusicUrl} type="audio/ogg" />
        </audio>
      )}

      <Container maxWidth="md" sx={{ py: 4, position: 'relative', zIndex: 2 }}>
        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 6,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Typography variant="h1" sx={{ mb: 3, fontSize: { xs: '3rem', sm: '4rem', md: '6rem' } }}>
                    🎂
                  </Typography>
                </motion.div>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  สุขสันต์วันเกิด!
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#333', fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}>
                  {card.recipientName} 🎉
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 4,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    py: 3,
                    px: 4,
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                      textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                      mb: 1,
                    }}
                  >
                    🎊 {card.recipientName} 🎊
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.95)',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    เกม {currentGameIndex + 1} จาก {card.games.length}
                  </Typography>
                </Box>
              </motion.div>

              <AnimatePresence mode="wait">
                {GameComponent && (
                  <motion.div
                    key={currentGame.id}
                    initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  >
                    <GameComponent config={currentGame.config} onComplete={handleGameComplete} />
                  </motion.div>
                )}
              </AnimatePresence>

              {currentGameIndex === card.games.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      mt: 4,
                      p: 4,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        🎉✨🎊
                      </Typography>
                    </motion.div>
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                        textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      ขอให้มีความสุขมากๆ นะ! 💝
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
}
