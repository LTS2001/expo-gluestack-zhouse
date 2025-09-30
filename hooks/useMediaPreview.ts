import { useState } from 'react';
import useBackHandlers from './useBackHandlers';

interface IState {
  videoPreviewVisible: boolean;
  setVideoPreviewVisible: (visible: boolean) => void;
  videoPreviewIndex: number;
  setVideoPreviewIndex: (index: number) => void;
  imagePreviewVisible: boolean;
  setImagePreviewVisible: (visible: boolean) => void;
  imagePreviewIndex: number;
  setImagePreviewIndex: (index: number) => void;
}

export default function useMediaPreview(): IState {
  const [videoPreview, setVideoPreview] = useState<{
    visible: boolean;
    index: number;
  }>({
    visible: false,
    index: 0,
  });
  const [imagePreview, setImagePreview] = useState({
    visible: false,
    index: 0,
  });

  useBackHandlers(() => {
    if (videoPreview.visible || imagePreview.visible) {
      setVideoPreviewVisible(false);
      setImagePreviewVisible(false);
      return true;
    }
    return false;
  });

  const setVideoPreviewVisible = (visible: boolean) =>
    setVideoPreview((prev) => ({ ...prev, visible }));
  const setVideoPreviewIndex = (index: number) =>
    setVideoPreview((prev) => ({ ...prev, index }));
  const setImagePreviewVisible = (visible: boolean) =>
    setImagePreview((prev) => ({ ...prev, visible }));
  const setImagePreviewIndex = (index: number) =>
    setImagePreview((prev) => ({ ...prev, index }));

  return {
    videoPreviewVisible: videoPreview.visible,
    setVideoPreviewVisible,
    videoPreviewIndex: videoPreview.index,
    setVideoPreviewIndex,
    imagePreviewVisible: imagePreview.visible,
    setImagePreviewVisible,
    imagePreviewIndex: imagePreview.index,
    setImagePreviewIndex,
  };
}
