'use client';

import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const authenticated = mounted ? isAuthenticated() : false;

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
        }}
      >
        <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1 },
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                bgcolor: '#1565C0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(45deg)',
                flexShrink: 0,
              }}
            >
              <Typography sx={{ transform: 'rotate(-45deg)', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>🎂</Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
                color: '#1565C0',
                letterSpacing: -0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Birthday Card
            </Typography>
          </Box>
          <Box sx={{ width: 200 }} /> {/* Placeholder for buttons */}
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
      }}
    >
      <Toolbar sx={{ py: { xs: 1, sm: 1.5 }, px: { xs: 1, sm: 2 } }}>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            cursor: 'pointer',
            minWidth: 0,
          }}
          onClick={() => router.push(authenticated ? '/dashboard' : '/')}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              bgcolor: '#1565C0',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(45deg)',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ transform: 'rotate(-45deg)', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>🎂</Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '0.85rem', sm: '1rem', md: '1.1rem' },
              color: '#1565C0',
              letterSpacing: -0.5,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Birthday Card
          </Typography>
        </Box>

        {authenticated ? (
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, alignItems: 'center', flexShrink: 0 }}>
            <Box
              sx={{
                bgcolor: 'rgba(21,101,192,0.15)',
                px: { xs: 1, sm: 1.5, md: 2 },
                py: 0.5,
                borderRadius: 2,
                border: '2px solid #1565C0',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Typography variant="body2" sx={{ color: '#1565C0', fontWeight: 800, fontSize: { sm: '0.75rem', md: '0.875rem' } }}>
                {user?.username || ''}
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => router.push('/dashboard')}
              sx={{
                color: '#1565C0',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                px: { xs: 0.5, sm: 1, md: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: 'auto',
                '&:hover': { bgcolor: 'rgba(21,101,192,0.1)' },
              }}
            >
              การ์ด
            </Button>
            <Button
              variant="text"
              onClick={() => router.push('/create')}
              sx={{
                color: '#1565C0',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                px: { xs: 0.5, sm: 1, md: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: 'auto',
                '&:hover': { bgcolor: 'rgba(21,101,192,0.1)' },
              }}
            >
              + สร้าง
            </Button>
            <Button
              variant="text"
              onClick={handleLogout}
              sx={{
                color: '#1565C0',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
                px: { xs: 0.5, sm: 1, md: 1.5 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: 'auto',
                '&:hover': { bgcolor: 'rgba(244,67,54,0.1)', color: '#d32f2f' },
              }}
            >
              ออก
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
            <Button
              variant="text"
              onClick={() => router.push('/login')}
              sx={{
                color: '#1565C0',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                px: { xs: 1, sm: 1.5, md: 2 },
                py: { xs: 0.5, sm: 0.75 },
                '&:hover': { bgcolor: 'rgba(21,101,192,0.1)' },
              }}
            >
              เข้าสู่ระบบ
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push('/register')}
              sx={{
                bgcolor: '#1565C0',
                color: 'white',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 0.75 },
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(21,101,192,0.4)',
                '&:hover': {
                  bgcolor: '#0D47A1',
                  boxShadow: '0 6px 16px rgba(21,101,192,0.5)',
                },
              }}
            >
              สมัครสมาชิก
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
