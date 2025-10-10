import { getTenantLeaseRefundList } from '@/business';
import { UploadImages } from '@/components';
import { StarRating } from '@/components/star-rating';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlErrorText,
  showToast,
  Text,
  Textarea,
  TextareaInput,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { postCommentApi } from '@/request';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';

const formSchema = z.object({
  houseScore: z
    .number({ required_error: '房屋评分不允许为空！' })
    .min(1, { message: '房屋评分不允许为空！' }),
  landlordScore: z
    .number({ required_error: '房东评分不允许为空！' })
    .min(1, { message: '房东评分不允许为空！' }),
  comment: z
    .string({ required_error: '评论内容不允许为空！' })
    .min(1, { message: '评论内容不允许为空！' }),
  image: z.array(z.string()).optional(),
});

type TFormSchema = z.infer<typeof formSchema>;

export default function CommentHouse() {
  const { houseName, houseId, landlordId, tenantId, leaseId } =
    useLocalSearchParams();
  const navigation = useNavigation();
  const textareaInputRef = useRef<any>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    navigation.setOptions({
      title: houseName,
    });
  }, [navigation, houseName]);

  const submitComment = async (params: TFormSchema) => {
    const { houseScore, landlordScore, comment, image } = params;
    await postCommentApi({
      houseId: Number(houseId),
      landlordId: Number(landlordId),
      tenantId: Number(tenantId),
      leaseId: Number(leaseId),
      houseScore,
      landlordScore,
      comment,
      image: JSON.stringify(image),
    });
    await getTenantLeaseRefundList();
    router.back();
    showToast({
      title: '评论成功',
      icon: 'success',
    });
  };

  return (
    <ScrollView
      contentContainerClassName='flex-grow'
      showsVerticalScrollIndicator={false}
    >
      <View className='flex-1 p-4 gap-8 bg-background-50'>
        <FormControl>
          <View className='flex-row items-center gap-4'>
            <Text className='text-lg'>房屋评分：</Text>
            <Controller
              name='houseScore'
              control={control}
              render={({ field }) => (
                <StarRating
                  size={26}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>
          <FormControlErrorText className='absolute -bottom-6'>
            {errors?.houseScore?.message}
          </FormControlErrorText>
        </FormControl>
        <FormControl>
          <View className='flex-row items-center gap-4'>
            <Text className='text-lg'>房东评分：</Text>
            <Controller
              name='landlordScore'
              control={control}
              render={({ field }) => (
                <StarRating
                  size={26}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </View>
          <FormControlErrorText className='absolute -bottom-6'>
            {errors?.landlordScore?.message}
          </FormControlErrorText>
        </FormControl>
        <FormControl>
          <View className='gap-2'>
            <Text className='text-lg'>评论内容：</Text>
            <Controller
              name='comment'
              control={control}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  onPress={() => {
                    textareaInputRef.current?.focus();
                  }}
                >
                  <Textarea>
                    <TextareaInput
                      ref={textareaInputRef}
                      onChangeText={onChange}
                      value={value}
                      placeholder='请输入您宝贵的评价'
                    />
                  </Textarea>
                </TouchableOpacity>
              )}
            />
          </View>
          <FormControlErrorText className='absolute -bottom-6'>
            {errors?.comment?.message}
          </FormControlErrorText>
        </FormControl>
        <FormControl>
          <View className='gap-4'>
            <Text className='text-lg'>图片：</Text>
            <Controller
              control={control}
              name='image'
              render={({ field: { onChange, value } }) => (
                <UploadImages value={value} onChange={onChange} />
              )}
            />
          </View>
          <FormControlErrorText className='absolute -bottom-6'>
            {errors?.image?.message}
          </FormControlErrorText>
        </FormControl>
        <Button onPress={() => handleSubmit(submitComment)()}>
          <ButtonText>提交</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}
