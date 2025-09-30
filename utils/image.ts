import { THUMBNAIL_MIDDLE_SIZE } from '@/constants';
import { IVideoThumbnail } from '@/global';

/**
 * handle video thumbnail
 * @param ThumbnailInfo video thumbnail info
 * @returns
 */
export const handleVideoThumbnail = (
  thumbnailInfo: IVideoThumbnail
): IVideoThumbnail => {
  const { aspectRatio } = thumbnailInfo;
  let size = {
    width: Math.round(THUMBNAIL_MIDDLE_SIZE * aspectRatio),
    height: THUMBNAIL_MIDDLE_SIZE,
  };
  if (aspectRatio > 1) {
    size = {
      width: THUMBNAIL_MIDDLE_SIZE,
      height: Math.round(THUMBNAIL_MIDDLE_SIZE / aspectRatio),
    };
  }
  return {
    ...thumbnailInfo,
    ...size,
  };
};
