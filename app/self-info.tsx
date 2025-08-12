import { updateUserInfo, uploadHeaderImage } from '@/business';
import { ImagePreview } from '@/components';
import {
  Button,
  ButtonText,
  DrawerGroup,
  FormControl,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  Icon,
  Image,
  Input,
  InputField,
  Text,
  TouchableOpacity,
  View,
  showToast,
} from '@/components/ui';
import { DELETE, NORMAL, STOP_USING, UN_IDENTITY } from '@/constants';
import { userStore } from '@/stores';
import { formatUtcTime } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import cls from 'classnames';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { ReactNode, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';
interface IUserInfoConfig {
  type: 'text' | 'image' | 'node';
  text: string;
  content: string | ReactNode;
  event?: () => void;
}

type IUserIdentityConfig = IUserInfoConfig;

const SelfInfo = () => {
  const { user } = userStore;
  const [headerImageVisible, setHeaderImageVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);
  const formSchema = z.object({
    name: z.string().min(1, { message: '请输入你要更改的名字' }).max(12),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    setValue('name', user?.name || '');
  }, [changeNameVisible, user, setValue]);
  /**
   * get currently user status text
   * @param status user status
   */
  const getStatusText = (status: number) => {
    switch (status) {
      // 正常
      case NORMAL:
        return '正常';
      // 停用
      case STOP_USING:
        return '停用';
      // 删除
      case DELETE:
        return '删除';
      // 未实名
      case UN_IDENTITY:
        return '未实名';
    }
  };
  const headImgUploadSuccess = async () => {
    const url = await uploadHeaderImage();
    if (url) showToast({ title: '头像更换成功！', icon: 'success' });
  };
  const userInfoConfig: IUserInfoConfig[] = [
    {
      type: 'image',
      text: '头像',
      content: (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            setHeaderImageVisible(true);
          }}
        >
          <Image
            src={user?.headImg}
            size='xs'
            className='rounded-sm overflow-hidden'
          />
        </TouchableOpacity>
      ),
      event: headImgUploadSuccess,
    },
    {
      type: 'text',
      text: '名字',
      content: user?.name,
      event: () => {
        setChangeNameVisible(true);
      },
    },
    {
      type: 'text',
      text: '手机号',
      content: user?.phone,
    },
    {
      type: 'text',
      text: '注册时间',
      content: formatUtcTime(user?.createdAt),
    },
    {
      type: 'text',
      text: '最近修改时间',
      content: formatUtcTime(user?.createdAt),
    },
    {
      type: 'node',
      text: '状态',
      content: (
        <View
          className={cls([
            'px-2 py-1 rounded-md',
            {
              'bg-theme-primary': user?.status === NORMAL,
              'bg-error-300': [STOP_USING, DELETE].includes(user?.status!),
              'bg-primary-50': user?.status === UN_IDENTITY,
            },
          ])}
        >
          <Text className='text-secondary-0 text-sm'>
            {getStatusText(user?.status!)}
          </Text>
        </View>
      ),
    },
  ];

  const identityInfoConfig: IUserIdentityConfig[] = [
    {
      type: 'text',
      text: '姓名',
      content: user?.identityName,
    },
    {
      type: 'text',
      text: '性别',
      content: user?.identitySex ? '男' : '女',
    },
    {
      type: 'text',
      text: '民族',
      content: user?.identityNation,
    },
    {
      type: 'text',
      text: '身份证号码',
      content: user?.identityNumber,
    },
    {
      type: 'text',
      text: '身份证所在地',
      content: user?.identityAddress,
    },
  ];
  /**
   * handle change name
   */
  const handleConfirm = async (val: z.infer<typeof formSchema>) => {
    const { name } = val;
    await updateUserInfo({ name });
    setChangeNameVisible(false);
    showToast({ title: '保存成功', icon: 'success' });
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className='bg-background-0 px-4 rounded-xl'>
        {userInfoConfig.map((info, idx) => {
          const { event, text, type, content } = info;
          return (
            <TouchableOpacity
              className={cls([
                'flex-row items-center py-5 border-secondary-400 px-2',
                {
                  'border-b': idx !== userInfoConfig.length - 1,
                },
              ])}
              key={idx}
              onPress={event}
            >
              <Text className='flex-1 text-lg'>{text}</Text>
              {type === 'text' ? (
                <Text className='text-lg text-primary-100'>{content}</Text>
              ) : (
                content
              )}
              {event && (
                <Icon
                  as='AntDesign'
                  name='right'
                  size={18}
                  className='ml-2 -mr-2'
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View className='bg-background-0 px-4 mt-4 rounded-xl'>
        {/* 实名信息 */}
        {user?.status === NORMAL &&
          identityInfoConfig.map((info, idx) => (
            <TouchableOpacity
              className={cls([
                'flex-row items-center py-4 border-secondary-400 px-2',
                {
                  'border-b': idx !== identityInfoConfig.length - 1,
                },
              ])}
              key={idx}
              onPress={info.event}
            >
              <Text className='flex-1 text-lg'>{info.text}</Text>
              {info.type === 'text' ? (
                <Text className='text-lg text-primary-100'>{info.content}</Text>
              ) : (
                info.content
              )}
            </TouchableOpacity>
          ))}
      </View>
      {/* real name entry */}
      {user?.status === UN_IDENTITY && (
        <TouchableOpacity
          className='mx-4 my-10'
          onPress={() => router.push('/identity-verify')}
        >
          <Button>
            <ButtonText>去实名</ButtonText>
          </Button>
        </TouchableOpacity>
      )}
      <ImagePreview
        srcs={user?.headImg}
        visible={headerImageVisible}
        onClose={() => setHeaderImageVisible(false)}
      />
      <DrawerGroup
        visible={changeNameVisible}
        onClose={() => setChangeNameVisible(false)}
        onConfirm={handleSubmit(handleConfirm)}
        title={<Text className='font-bold text-2xl'>更改名字</Text>}
        content={
          <FormControl>
            <Controller
              name='name'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input variant='underlined'>
                  <Icon
                    as='AntDesign'
                    name='smileo'
                    className='mx-2'
                    size={20}
                  />
                  <InputField
                    placeholder='请输入你的名字'
                    onChangeText={onChange}
                    value={value}
                  />
                </Input>
              )}
            />
            <FormControlHelper className='mt-3'>
              <FormControlHelperText>
                好的名字可以让对方更容易记住你。
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlErrorText className='mt-1'>
              {errors.name?.message}
            </FormControlErrorText>
          </FormControl>
        }
      />
    </ScrollView>
  );
};

export default observer(SelfInfo);
