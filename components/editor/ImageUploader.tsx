'use client';

import { useState, useRef } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { uploadApi } from '@/lib/api/upload';
import { useSnackbar } from 'notistack';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
  compact?: boolean;
}

export function ImageUploader({ onImageUploaded, currentImageUrl, compact = false }: ImageUploaderProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('กรุณาเลือกไฟล์รูปภาพเท่านั้น', { variant: 'warning' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar('ไฟล์ใหญ่เกิน 10MB', { variant: 'warning' });
      return;
    }

    try {
      setUploading(true);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const response = await uploadApi.uploadImage(file);
      onImageUploaded(response.url);
      enqueueSnackbar('อัปโหลดรูปภาพสำเร็จ!', { variant: 'success' });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {previewUrl ? (
        <Box sx={{ position: 'relative', mb: compact ? 1 : 2 }}>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              width: '100%',
              height: compact ? 120 : 'auto',
              maxHeight: compact ? 120 : 300,
              objectFit: 'cover',
              borderRadius: compact ? 2 : 3,
              boxShadow: compact ? '0 2px 8px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.15)',
              border: compact ? '2px solid rgba(79, 172, 254, 0.2)' : '3px solid rgba(102, 126, 234, 0.3)',
              cursor: 'pointer',
            }}
            onClick={handleButtonClick}
          />
          {compact && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
                onImageUploaded(''); // ⭐ ส่ง empty string เพื่อลบรูป
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                minWidth: 'auto',
                width: 24,
                height: 24,
                p: 0,
                bgcolor: 'rgba(244, 67, 54, 0.9)',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '50%',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 1)',
                },
              }}
            >
              ×
            </Button>
          )}
          {uploading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.6)',
                borderRadius: compact ? 2 : 3,
                backdropFilter: 'blur(4px)',
              }}
            >
              <CircularProgress size={compact ? 24 : 40} sx={{ color: 'white' }} />
            </Box>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: compact ? 120 : 200,
            border: compact ? '2px dashed rgba(79, 172, 254, 0.3)' : '3px dashed rgba(102, 126, 234, 0.4)',
            borderRadius: compact ? 2 : 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: compact ? 0 : 2,
            background: compact 
              ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            transition: 'all 0.3s',
            cursor: 'pointer',
            '&:hover': {
              borderColor: compact ? '#4facfe' : '#667eea',
              background: compact 
                ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              transform: 'translateY(-2px)',
            },
          }}
          onClick={handleButtonClick}
        >
          <CloudUpload sx={{ fontSize: compact ? '2rem' : '4rem', color: compact ? '#4facfe' : '#667eea', mb: compact ? 0.5 : 1 }} />
          {!compact && (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                คลิกเพื่อเลือกรูปภาพ
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                รองรับไฟล์ JPG, PNG (สูงสุด 10MB)
              </Typography>
            </>
          )}
          {compact && (
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#4facfe', fontSize: '0.7rem', mt: 0.5 }}>
              เลือกรูป
            </Typography>
          )}
        </Box>
      )}

      {!compact && (
        <Button
          variant="contained"
          startIcon={uploading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CloudUpload />}
          onClick={handleButtonClick}
          disabled={uploading}
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
            },
            '&.Mui-disabled': {
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%)',
            },
          }}
        >
          {uploading ? 'กำลังอัปโหลด...' : previewUrl ? '🔄 เปลี่ยนรูปภาพ' : '📤 เลือกรูปภาพ'}
        </Button>
      )}
    </Box>
  );
}
