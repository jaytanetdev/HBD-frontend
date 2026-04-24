'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import { CloudUpload, Close as CloseIcon, MusicNote, VideoLibrary } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { uploadApi } from '@/lib/api/upload';

interface MediaUploaderProps {
  onMediaUploaded: (url: string) => void;
  currentMediaUrl?: string;
  mediaType?: 'audio' | 'video' | 'both';
  compact?: boolean;
}

export function MediaUploader({ 
  onMediaUploaded, 
  currentMediaUrl, 
  mediaType = 'audio',
  compact = false 
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(
    typeof currentMediaUrl === 'string' ? currentMediaUrl : ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Update preview when currentMediaUrl changes
  useEffect(() => {
    setPreview(typeof currentMediaUrl === 'string' ? currentMediaUrl : '');
  }, [currentMediaUrl]);

  const getAcceptTypes = () => {
    if (mediaType === 'audio') return 'audio/mpeg,.mp3';
    if (mediaType === 'video') return 'video/*';
    return 'audio/mpeg,.mp3,video/*';
  };

  const getFileTypeLabel = () => {
    if (mediaType === 'audio') return 'เสียง';
    if (mediaType === 'video') return 'วิดีโอ';
    return 'เสียง/วิดีโอ';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const isAudioFile = file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.toLowerCase().endsWith('.mp3');
    const isVideoFile = file.type.startsWith('video/');
    
    if (mediaType === 'audio' && !isAudioFile) {
      enqueueSnackbar('กรุณาเลือกไฟล์ MP3 เท่านั้น', { variant: 'error' });
      return;
    }
    
    if (mediaType === 'video' && !isVideoFile) {
      enqueueSnackbar('กรุณาเลือกไฟล์วิดีโอ (MP4, WebM, MOV)', { variant: 'error' });
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      enqueueSnackbar('ไฟล์ใหญ่เกินไป (สูงสุด 50MB)', { variant: 'error' });
      return;
    }

    try {
      setUploading(true);
      const response = await uploadApi.uploadImage(file);
      const url = response.url; // Extract URL from response object
      setPreview(url);
      onMediaUploaded(url);
      enqueueSnackbar(isAudioFile ? 'อัพโหลดเพลงสำเร็จ! 🎵' : 'อัพโหลดสำเร็จ! 🎬', { variant: 'success' });
    } catch (error) {
      console.error('Upload failed:', error);
      enqueueSnackbar('อัพโหลดไม่สำเร็จ กรุณาลองใหม่', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('ต้องการลบไฟล์นี้?')) return;
    
    try {
      setUploading(true); // Show loading while deleting
      
      // Delete from Cloudinary if there's a file URL
      if (preview) {
        await uploadApi.deleteFile(preview);
      }
      
      setPreview('');
      onMediaUploaded('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      enqueueSnackbar('ลบไฟล์สำเร็จ', { variant: 'success' });
    } catch (error) {
      console.error('Delete failed:', error);
      enqueueSnackbar('ลบไฟล์ไม่สำเร็จ กรุณาลองใหม่', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isAudio = Boolean(
    preview && 
    typeof preview === 'string' && 
    preview.length > 0 &&
    (preview.includes('.mp3') || preview.includes('audio'))
  );
  
  const isVideo = Boolean(
    preview && 
    typeof preview === 'string' && 
    preview.length > 0 &&
    !isAudio &&
    (preview.includes('.mp4') || preview.includes('.webm') || preview.includes('.mov') || preview.includes('video'))
  );

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {preview ? (
        <Box
          sx={{
            position: 'relative',
            mb: compact ? 1 : 2,
            borderRadius: compact ? 2 : 3,
            overflow: 'hidden',
            boxShadow: compact ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.15)',
            border: compact ? '2px solid rgba(79, 172, 254, 0.2)' : '3px solid rgba(102, 126, 234, 0.3)',
          }}
        >
          <IconButton
            onClick={handleRemove}
            disabled={uploading}
            sx={{
              position: 'absolute',
              top: compact ? 4 : 8,
              right: compact ? 4 : 8,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              zIndex: 10,
              '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              '&:disabled': { bgcolor: 'rgba(0,0,0,0.3)' },
              width: compact ? 28 : 32,
              height: compact ? 28 : 32,
            }}
          >
            {uploading ? <CircularProgress size={compact ? 16 : 20} sx={{ color: 'white' }} /> : <CloseIcon fontSize={compact ? 'small' : 'medium'} />}
          </IconButton>

          {isAudio ? (
            <Box sx={{ p: compact ? 2 : 3, bgcolor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <MusicNote sx={{ fontSize: compact ? '3rem' : '4rem', color: '#4facfe' }} />
              </Box>
              <audio 
                controls 
                style={{ width: '100%' }}
                key={preview}
              >
                <source src={preview} type="audio/mpeg" />
                <source src={preview} type="audio/mp3" />
                <source src={preview} type="audio/wav" />
                <source src={preview} type="audio/ogg" />
                Your browser does not support the audio element.
              </audio>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 1, 
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.75rem'
                }}
              >
                🎵 ไฟล์เพลง
              </Typography>
            </Box>
          ) : isVideo ? (
            <video 
              controls 
              style={{ 
                width: '100%', 
                maxHeight: compact ? 200 : 300,
                display: 'block',
              }}
            >
              <source src={preview} />
            </video>
          ) : (
            <Box sx={{ p: compact ? 2 : 3, bgcolor: '#f5f5f5', textAlign: 'center' }}>
              <VideoLibrary sx={{ fontSize: compact ? '3rem' : '4rem', color: '#4facfe', mb: 1 }} />
              <Typography variant={compact ? 'caption' : 'body2'}>
                ไฟล์สื่อ
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Box
          onClick={handleButtonClick}
          sx={{
            position: 'relative',
            height: compact ? 120 : 180,
            border: compact ? '2px dashed rgba(79, 172, 254, 0.3)' : '3px dashed rgba(102, 126, 234, 0.4)',
            borderRadius: compact ? 2 : 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: compact 
              ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: compact ? '#4facfe' : '#667eea',
              background: compact 
                ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              transform: 'translateY(-2px)',
            },
            mb: compact ? 1 : 2,
          }}
        >
          {uploading ? (
            <CircularProgress size={compact ? 32 : 40} sx={{ color: compact ? '#4facfe' : '#667eea' }} />
          ) : (
            <>
              <CloudUpload sx={{ fontSize: compact ? '2rem' : '4rem', color: compact ? '#4facfe' : '#667eea', mb: compact ? 0.5 : 1 }} />
              {!compact && (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#667eea' }}>
                    คลิกเพื่อเลือกไฟล์{getFileTypeLabel()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {mediaType === 'audio' 
                      ? 'รองรับ MP3 (สูงสุด 50MB)'
                      : mediaType === 'video'
                      ? 'รองรับ MP4, WebM, MOV (สูงสุด 50MB)'
                      : 'รองรับ MP3, MP4 (สูงสุด 50MB)'
                    }
                  </Typography>
                </>
              )}
              {compact && (
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#4facfe', fontSize: '0.7rem', mt: 0.5 }}>
                  เลือกไฟล์{getFileTypeLabel()}
                </Typography>
              )}
            </>
          )}
        </Box>
      )}

      {!compact && !preview && (
        <Button
          variant="contained"
          fullWidth
          onClick={handleButtonClick}
          disabled={uploading}
          startIcon={<CloudUpload />}
          sx={{
            borderRadius: 2,
            py: 1.5,
            bgcolor: '#667eea',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              bgcolor: '#5568d3',
              boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
            },
          }}
        >
          เลือกไฟล์{getFileTypeLabel()}
        </Button>
      )}
    </Box>
  );
}
