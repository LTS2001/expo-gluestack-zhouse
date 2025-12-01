import { getRepairListTenant, sendMessage } from '@/business';
import { UploadImages, UploadVideos } from '@/components';
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
import {
  ESocketMessageActionEnum,
  EUserIdentityEnum
} from '@/constants';
import { postRepairApi } from '@/request';
import { userStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';

const formSchema = z.object({
  reason: z.string().min(1, { message: '问题描述不允许为空！' }),
  imgList: z.array(z.string()),
  video: z.object({
    thumbnail: z.object({
      path: z.string(),
      width: z.number(),
      height: z.number(),
      aspectRatio: z.number(),
    }),
    path: z.string(),
    width: z.number(),
    height: z.number(),
    aspectRatio: z.number(),
    duration: z.number(),
  }),
});

type TFormSchema = z.infer<typeof formSchema>;

const TenantReportForRepair = () => {
  const { user } = userStore;
  const textareaInputRef = useRef<any>(null);
  const { houseId, landlordId } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
      imgList: [],
      video: {
        thumbnail: {
          path: '',
          width: 0,
          height: 0,
          aspectRatio: 0,
        },
        path: '',
        width: 0,
        height: 0,
        aspectRatio: 0,
        duration: 0,
      },
    },
  });

  /**
   * submit maintenance for tenant
   * @param params - the form data
   */
  const submitMaintenance = async (params: TFormSchema) => {
    const { reason, imgList, video: videoInfo } = params;
    await postRepairApi({
      reason,
      image: JSON.stringify(imgList),
      video: JSON.stringify(videoInfo),
      houseId: Number(houseId),
      landlordId: Number(landlordId),
      tenantId: user?.id!,
    });
    // again get tenant's repair list
    await getRepairListTenant(user?.id);
    // send message to landlord
    sendMessage({
      toIdentity: EUserIdentityEnum.Landlord,
      toId: Number(landlordId),
      active: ESocketMessageActionEnum.GetLandlordRepair,
    });
    router.back();
    showToast({ title: '提交成功', icon: 'success' });
  };

  return (
    <ScrollView>
      <View className='bg-background-0 flex-1 p-4 gap-8'>
        <FormControl>
          <View className='gap-4'>
            <Text>问题描述：</Text>
            <Controller
              control={control}
              name='reason'
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
                      placeholder='请输入遇到的问题'
                    />
                  </Textarea>
                </TouchableOpacity>
              )}
            />
            <FormControlErrorText className='absolute -bottom-6'>
              {errors?.reason?.message}
            </FormControlErrorText>
          </View>
        </FormControl>
        <FormControl>
          <View className='gap-4'>
            <Text>问题图片：</Text>
            <Controller
              control={control}
              name='imgList'
              render={({ field: { onChange, value } }) => (
                <UploadImages value={value} onChange={onChange} />
              )}
            />
          </View>
        </FormControl>
        <FormControl>
          <View className='gap-4'>
            <Text>问题视频：</Text>
            <Controller
              control={control}
              name='video'
              render={({ field: { onChange, value } }) => (
                <UploadVideos value={value} onChange={onChange} />
              )}
            />
          </View>
        </FormControl>
        <Button onPress={() => handleSubmit(submitMaintenance)()}>
          <ButtonText>提交</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default TenantReportForRepair;
