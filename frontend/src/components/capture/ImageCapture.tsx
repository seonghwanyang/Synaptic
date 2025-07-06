'use client';

import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import { Camera, Upload, X, RotateCw, Check } from 'lucide-react';
import { useCaptureStore } from '@/lib/stores/captureStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ImageCapture() {
  const { updateCurrentCapture, setCapturing } = useCaptureStore();
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const handleImageFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageFile(file);
    updateCurrentCapture({ file, fileUrl: url });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      handleImageFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: mode === 'camera'
  });

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          handleImageFile(file);
        });
      setCapturing(false);
    }
  }, [setCapturing]);

  const resetImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setImageFile(null);
    updateCurrentCapture({ file: undefined, fileUrl: undefined });
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      {!imageUrl && (
        <div className="flex gap-2 justify-center">
          <Button
            variant={mode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('upload')}
            className={mode === 'upload' ? 'bg-coral-600 hover:bg-coral-700' : ''}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button
            variant={mode === 'camera' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('camera')}
            className={mode === 'camera' ? 'bg-coral-600 hover:bg-coral-700' : ''}
          >
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </Button>
        </div>
      )}

      {/* Image preview */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Captured"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700"
          />
          <Button
            onClick={resetImage}
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && !imageUrl && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive 
              ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/10' 
              : 'border-gray-300 dark:border-gray-700 hover:border-coral-400'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
          {isDragActive ? (
            <p className="text-coral-600 dark:text-coral-400">Drop the image here...</p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Camera mode */}
      {mode === 'camera' && !imageUrl && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full"
            />
          </div>
          <div className="flex justify-center">
            <Button
              onClick={capturePhoto}
              size="lg"
              className="bg-coral-600 hover:bg-coral-700"
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture Photo
            </Button>
          </div>
        </div>
      )}

      {/* Success state */}
      {imageUrl && (
        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
          <Check className="h-5 w-5" />
          <span>Image ready to save</span>
        </div>
      )}
    </div>
  );
}