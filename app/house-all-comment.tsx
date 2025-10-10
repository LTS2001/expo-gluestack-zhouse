import { Empty, ImagePreview, StarRating } from '@/components';
import { Image, Text, TouchableOpacity, View } from '@/components/ui';
import { IComment } from '@/global';
import { useMediaPreview } from '@/hooks';
import { getHouseCommentListApi } from '@/request';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';

/**
 * TODO: 后续加入点评人
 */
export default function HouseAllComment() {
  const navigation = useNavigation();
  const { houseName, houseId, leaseId, tenantId } = useLocalSearchParams();
  const {
    imagePreviewVisible,
    setImagePreviewVisible,
    setImagePreviewIndex,
    imagePreviewIndex,
  } = useMediaPreview();
  const [allCommentList, setAllCommentList] = useState<IComment[]>();
  const [currentImagePreview, setCurrentImagePreview] = useState<string[]>();
  useEffect(() => {
    navigation.setOptions({
      title: houseName,
    });
  }, [navigation, houseName]);
  useEffect(() => {
    getHouseCommentListApi(Number(houseId)).then((res) => {
      if (leaseId && res instanceof Array) {
        let currentTenantCommentIndex: number = -1;
        res.forEach((r, idx: number) => {
          if (r.leaseId === Number(leaseId)) {
            currentTenantCommentIndex = idx;
          }
        });
        const currentTenantComment = JSON.parse(
          JSON.stringify(res.find((r) => r.leaseId === Number(leaseId)))
        );
        res.splice(currentTenantCommentIndex, 1);
        res.unshift(currentTenantComment);
        setAllCommentList(res);
      } else {
        setAllCommentList(res);
      }
    });
  }, [houseId, leaseId]);

  return (
    <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
      <View className='gap-4 pb-8 pt-4'>
        {allCommentList?.length ? (
          allCommentList?.map((comment: IComment, idx: number) => {
            return (
              <View key={idx}>
                <View
                  className='bg-background-0 p-4 rounded-lg mx-4 gap-3'
                  needShadow
                >
                  <View className='flex-row items-center gap-2'>
                    <Text className='text'>点评：</Text>
                    <Text className='txt'>{comment.comment}</Text>
                  </View>
                  <View className='flex-row items-center gap-2'>
                    <Text className='text'>房屋评分：</Text>
                    <StarRating size={20} value={comment.houseScore} disabled />
                  </View>
                  <View className='flex-row items-center gap-2'>
                    <Text className='text'>房东评分：</Text>
                    <StarRating
                      size={20}
                      value={comment.landlordScore}
                      disabled
                    />
                  </View>
                  <View className='flex-row items-center gap-4 flex-wrap'>
                    {JSON.parse(comment.image)?.map(
                      (url: string, i: number) => {
                        return (
                          <TouchableOpacity
                            key={i}
                            onPress={() => {
                              setCurrentImagePreview(JSON.parse(comment.image));
                              setImagePreviewIndex(i);
                              setImagePreviewVisible(true);
                            }}
                          >
                            <Image
                              className='w-32 h-20 rounded-md border-[1px] border-secondary-300'
                              src={url}
                            />
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                </View>
                {tenantId && idx === 0 ? (
                  <View className='items-center mt-4 flex-row justify-center gap-3'>
                    <View className='flex-1 h-[0.5px] bg-primary-50'></View>
                    <Text>以下是房屋的其他评论</Text>
                    <View className='flex-1 h-[0.5px] bg-primary-50'></View>
                  </View>
                ) : null}
              </View>
            );
          })
        ) : (
          <Empty text='该房屋暂无评论' />
        )}
        <ImagePreview
          srcs={currentImagePreview}
          visible={imagePreviewVisible}
          index={imagePreviewIndex}
          onClose={() => setImagePreviewVisible(false)}
        />
      </View>
    </ScrollView>
  );
}
