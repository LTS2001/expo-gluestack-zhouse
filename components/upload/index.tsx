import { uploadImage } from '@/business/upload';
import { Icon, Image, TouchableOpacity, View } from '@/components/ui';
import { useState } from 'react';
import ImagePreview from '../image-preview';

// define props interface of components and use generic
interface UploadImagesProps<T = string> {
  value?: T[];
  onChange?: (value: T[]) => void;
  maxCount?: number;
  disabled?: boolean;
}

// define image preview state interface
interface ImagePreviewState {
  visible: boolean;
  index: number;
}

// use generic to define component
export const UploadImages = ({
  value = [],
  onChange,
  maxCount = 9,
  disabled = false,
}: UploadImagesProps) => {
  const [imagePreview, setImagePreview] = useState<ImagePreviewState>({
    visible: false,
    index: 0,
  });

  const handleAddImage = async () => {
    if (disabled || (maxCount && value.length >= maxCount)) {
      return;
    }
    try {
      const res = await uploadImage({
        allowsEditing: true,
        aspect: [16, 10],
      });
      if (!res) return;
      if (value instanceof Array) {
        onChange?.([...value, res]);
      } else {
        onChange?.([res]);
      }
    } catch (error) {
      console.error('上传图片失败:', error);
    }
  };

  const handleImagePress = (index: number) => {
    setImagePreview({
      visible: true,
      index,
    });
  };

  const handlePreviewClose = () => {
    setImagePreview({
      visible: false,
      index: 0,
    });
  };

  return (
    <View className='flex-row flex-wrap gap-4'>
      {/* image list */}
      {value && Array.isArray(value) && value.length > 0
        ? value.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
            >
              <Image
                src={item}
                className='w-32 h-20 rounded-md border-[1px] border-secondary-300'
              />
            </TouchableOpacity>
          ))
        : null}
      {/* add image */}
      {(!maxCount || value.length < maxCount) && (
        <TouchableOpacity
          className='w-32 h-20 bg-secondary-300 flex justify-center items-center rounded-md'
          onPress={handleAddImage}
          disabled={disabled}
        >
          <Icon as='AntDesign' name='plus' size={24} />
        </TouchableOpacity>
      )}
      {/* image preview */}
      <ImagePreview
        srcs={value}
        visible={imagePreview.visible}
        onClose={handlePreviewClose}
        index={imagePreview.index}
      />
    </View>
  );
};
