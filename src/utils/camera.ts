import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = () => {
  return Capacitor.isNativePlatform();
};

export interface ImagePickerResult {
  file: File;
  dataUrl: string;
}

export const pickImageFromCamera = async (): Promise<ImagePickerResult> => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
  });

  if (!image.dataUrl) {
    throw new Error('No image data received');
  }

  // Convert base64 to File
  const response = await fetch(image.dataUrl);
  const blob = await response.blob();
  const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

  return {
    file,
    dataUrl: image.dataUrl,
  };
};

export const pickImageFromGallery = async (): Promise<ImagePickerResult> => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
  });

  if (!image.dataUrl) {
    throw new Error('No image data received');
  }

  // Convert base64 to File
  const response = await fetch(image.dataUrl);
  const blob = await response.blob();
  const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });

  return {
    file,
    dataUrl: image.dataUrl,
  };
};

export const requestCameraPermissions = async (): Promise<boolean> => {
  try {
    const permissions = await Camera.requestPermissions({
      permissions: ['camera', 'photos']
    });
    return permissions.camera === 'granted' || permissions.photos === 'granted';
  } catch (error) {
    console.error('Permission request error:', error);
    return false;
  }
};
