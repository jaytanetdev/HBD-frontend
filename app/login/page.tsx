'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, Container, Box, Typography, Paper, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';
import { useAuthStore } from '@/lib/stores/authStore';
import { authApi } from '@/lib/api/auth';
import { loginSchema } from '@/lib/schemas/validation';
import type { LoginData } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setError('');
      setIsLoading(true);
      const response = await authApi.login(data);
      setAuth(response.user, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1565C0 0%, #0D47A1 50%, #1976D2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(212, 255, 0, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 53, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(1.1)' },
        },
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4, md: 5 }, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(45deg)',
              mb: { xs: 2, sm: 2.5, md: 3 },
              boxShadow: '0 10px 40px rgba(212, 255, 0, 0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <Typography sx={{ transform: 'rotate(-45deg)', fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>🎂</Typography>
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'white',
              mb: 1,
              letterSpacing: -1,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
            }}
          >
            ยินดีต้อนรับกลับ!
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' } }}>
            เข้าสู่ระบบเพื่อสร้างการ์ดวันเกิดสุดพิเศษ
          </Typography>
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            bgcolor: 'white',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            position: 'relative',
            zIndex: 1,
            border: '3px solid #FFD54F',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('username')}
              label={
                <span>
                  Username <span style={{ color: '#f44336' }}>*</span>
                </span>
              }
              fullWidth
              required
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#1565C0' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#1565C0' },
                  '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1565C0', fontWeight: 700 },
                '& .MuiInputLabel-asterisk': { color: '#f44336' },
              }}
            />

            <TextField
              {...register('password')}
              label={
                <span>
                  Password <span style={{ color: '#f44336' }}>*</span>
                </span>
              }
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1565C0' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': { borderColor: '#1565C0' },
                  '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: 2 },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#1565C0', fontWeight: 700 },
                '& .MuiInputLabel-asterisk': { color: '#f44336' },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: { xs: 3, sm: 3.5, md: 4 },
                py: { xs: 1.3, sm: 1.5, md: 1.6 },
                background: 'linear-gradient(135deg, #FFD54F 0%, #FFC107 100%)',
                color: '#1565C0',
                textTransform: 'none',
                fontWeight: 900,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.05rem' },
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(255, 107, 53, 0.5)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFC107 0%, #FFB300 100%)',
                  boxShadow: '0 12px 32px rgba(255, 87, 34, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: { xs: 2.5, sm: 3 } }}>
              <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                ยังไม่มีบัญชี?{' '}
                <Typography
                  component="span"
                  onClick={() => router.push('/register')}
                  sx={{
                    color: '#1A1A1A',
                    fontWeight: 800,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    '&:hover': { color: '#1565C0' },
                  }}
                >
                  สมัครสมาชิกเลย
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
