import { useMediaPreview } from '@/hooks';
import { useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import ImagePreview from '../image-preview';
import { TouchableOpacity } from '../ui';
import { Image } from '../ui/image';

interface IProps {
  imgList: string[];
}

const HouseImageList = (props: IProps) => {
  const { imgList } = props;
  const {
    imagePreviewVisible,
    setImagePreviewVisible,
    imagePreviewIndex,
    setImagePreviewIndex,
  } = useMediaPreview();
  const windowWidth = Dimensions.get('window').width;
  const imageHeight = windowWidth / 1.6;
  const [currentIndex, setCurrentIndex] = useState(0);

  const openShowPreview = (idx: number) => {
    setImagePreviewVisible(true);
    setImagePreviewIndex(idx);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / windowWidth);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      >
        {imgList.map((url: string, idx: number) => (
          <TouchableOpacity key={idx} onPress={() => openShowPreview(idx)}>
            <Image
              src={url}
              style={{
                width: windowWidth,
                height: imageHeight,
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* dot indicator */}
      <View className='flex-row justify-center items-center mt-2 gap-2'>
        {imgList.map((_, idx) => (
          <View
            key={idx}
            className={`w-2 h-2 rounded-full ${
              currentIndex === idx ? 'bg-primary-950' : 'bg-secondary-700'
            }`}
          />
        ))}
      </View>
      <ImagePreview
        srcs={imgList}
        visible={imagePreviewVisible}
        index={imagePreviewIndex}
        onClose={() => setImagePreviewVisible(false)}
      />
    </View>
  );
};

export default HouseImageList;
