import { UploadImages } from '@/components';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlErrorText,
  Text,
  Textarea,
  TextareaInput,
  TouchableOpacity,
  View,
  showToast,
} from '@/components/ui';
import { userStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  reason: z.string().min(1, { message: '问题描述不允许为空！' }),
  imgList: z.array(z.string()),
  video: z.string(),
});

type TFormSchema = z.infer<typeof formSchema>;

const TenantReportForRepair = () => {
  const { user } = userStore;
  const textareaInputRef = useRef<any>(null);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: '房屋报修',
    });
  }, [navigation]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: '',
      imgList: [],
      video: '',
    },
  });
  // /**
  //  * 维修图片上传成功回调
  //  */
  // const maintenanceImgUploadSuccess = ({ responseText }) => {
  //   const res: any = JSON.parse(responseText.data);
  //   if (res.code !== CodeConstant.SUCCESS) {
  //     showToast({ title: '图片上传失败！', icon: 'error' });
  //     return;
  //   }
  //   showToast({ title: '图片上传成功！', icon: 'success' });
  //   setImgList((imgList) => [...imgList, res.data]);
  // };

  // /**
  //  * 维修视频上传成功回调
  //  */
  // const maintenanceVideoUploadSuccess = ({ responseText }) => {
  //   const res: any = JSON.parse(responseText.data);
  //   if (res.code !== CodeConstant.SUCCESS) {
  //     showToast({ title: '视频上传失败！', icon: 'error' });
  //     return;
  //   }
  //   showToast({ title: '视频上传成功！', icon: 'success' });
  //   setVideo(res.data);
  // };

  /**
   * 提交房屋维修
   */
  const submitMaintenance = async () => {
    // if (!reason) {
    //   showToast({
    //     title: '问题描述不允许为空！',
    //     icon: 'error',
    //   });
    // }
    // if (!routerParams?.houseId) {
    //   showToast({
    //     title: '房屋id不存在！',
    //     icon: 'error',
    //   });
    //   return;
    // }
    // await HouseReportBusiness.addReport({
    //   reason,
    //   image: JSON.stringify(imgList),
    //   video: video,
    //   houseId: Number(routerParams.houseId),
    //   landlordId: Number(routerParams.landlordId),
    //   tenantId: user.id,
    // });
    // // 重新获取租客的房屋维修信息
    // await getReportByTenantId(user.id!);
    // // 向房东发送维修消息
    // websocketInstance &&
    //   websocketInstance.send({
    //     data: JSON.stringify({
    //       toIdentity: AuthConstant.LANDLORD,
    //       toId: Number(routerParams.landlordId),
    //       active: BusinessConstant.SOCKET_GET_LANDLORD_REPORT,
    //     }),
    //   });
    // router.back();
    showToast({ title: '提交成功', icon: 'success' });
  };

  return (
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
                  console.log('onpress');
                  textareaInputRef.current?.focus();
                }}
              >
                <Textarea className='bg-blue-200'>
                  <TextareaInput
                    ref={textareaInputRef}
                    className='bg-pink-200 '
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
      <View className='gap-4'>
        <Text>问题视频：</Text>
      </View>
      <Button onPress={submitMaintenance}>
        <ButtonText>提交</ButtonText>
      </Button>
    </View>
  );
};

export default TenantReportForRepair;
