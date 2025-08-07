import { getUserInfo } from '@/business';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlErrorText,
  Icon,
  Image,
  Input,
  InputField,
  showToast,
  Text,
  View,
} from '@/components/ui';
import { LANDLORD, TENANT } from '@/constants';
import { postLoginApi, postRegistryApi } from '@/request';
import { authStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { z } from 'zod';

export default function Login() {
  const { identity } = authStore;
  const insets = useSafeAreaInsets();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checkPasswordVisible, setCheckPasswordVisible] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z
    .object({
      phone: z
        .string()
        .regex(/^[0-9]+$/, '手机号只能包含数字')
        .length(11, '请输入11位的手机号码')
        .refine((val) => /^1[3-9]\d{9}$/.test(val), '请输入正确的手机号格式'),
      password: z
        .string()
        .min(6, '密码至少6个字符')
        .max(20, '密码最多20个字符'),
      checkPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      // verify checkPassword field only when registering
      if (isRegister) {
        if (!data.checkPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['checkPassword'],
            message: '请再次输入密码',
          });
        } else if (data.password !== data.checkPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['checkPassword'],
            message: '两次输入的密码不一致',
          });
        }
      }
    });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  /**
   * get current identity, confirm the name is tenant or landlord
   * @returns tenant or landlord or null string
   */
  const getIdentityName = () => {
    switch (identity) {
      case TENANT:
        return '租客';
      case LANDLORD:
        return '房东';
      default:
        return '';
    }
  };

  const handleUserSubmit = async (data: z.infer<typeof formSchema>) => {
    const { phone, password } = data;
    try {
      if (isRegister) {
        await postRegistryApi({ phone, password });
        showToast({ title: '注册成功！', icon: 'success' });
        setIsRegister(false);
      } else {
        setIsLoading(true);
        await postLoginApi({ phone, password });
        // get user information
        await getUserInfo();
        router.back();
      }
    } catch (err) {
      console.log('err', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // when isRegister is change, should reset form value
    reset();
  }, [isRegister, reset]);

  return (
    <View style={{ paddingTop: insets.top + 16 }}>
      <Icon
        as='AntDesign'
        name='home'
        onTouchEnd={() => router.replace('/(tabs)')}
        position='start'
        className='ml-8'
      />
      <View className='items-center'>
        <Image source={require('@/assets/images/icon.png')} size='xl' />
      </View>
      <View className='mx-8 mt-4'>
        <View className='flex-row items-end'>
          <Text className='text-xl'>您好，</Text>
          <Text className='text-2xl font-bold text-theme-primary'>
            {getIdentityName()}
          </Text>
        </View>
        <View className='flex-row justify-end mt-2 items-end'>
          <Text className='text-xl'>欢迎使用</Text>
          <Text className='text-2xl font-bold text-theme-tertiary italic'>
            LTS行间小筑
          </Text>
        </View>
      </View>
      <View className='px-8 my-6'>
        <FormControl>
          <Controller
            name='phone'
            control={control}
            rules={{
              required: '手机号不能为空',
            }}
            render={({ field: { onChange, value } }) => (
              <Input variant='underlined'>
                <Icon as='AntDesign' name='phone' size={20} className='mx-2' />
                <InputField
                  placeholder='请输入手机号'
                  onChangeText={onChange}
                  value={value || '1536172193'}
                  keyboardType='phone-pad'
                  maxLength={11}
                />
              </Input>
            )}
          />
          <FormControlErrorText className='ml-10'>
            {errors?.phone?.message}
          </FormControlErrorText>
        </FormControl>
        <FormControl>
          <Controller
            name='password'
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input variant='underlined'>
                <Icon as='AntDesign' name='lock' className='mx-1.5' />
                <InputField
                  placeholder='请输入密码'
                  type={passwordVisible ? 'text' : 'password'}
                  onChangeText={onChange}
                  value={value || '12345'}
                  keyboardType='number-pad'
                />
                {passwordVisible ? (
                  <Icon
                    as='Feather'
                    name='eye'
                    size={20}
                    className='mx-3'
                    onTouchEnd={() => setPasswordVisible(false)}
                  />
                ) : (
                  <Icon
                    as='Feather'
                    name='eye-off'
                    size={20}
                    className='mx-3'
                    onTouchEnd={() => setPasswordVisible(true)}
                  />
                )}
              </Input>
            )}
          />
          <FormControlErrorText className='ml-10'>
            {errors?.password?.message}
          </FormControlErrorText>
        </FormControl>
        {isRegister && (
          <FormControl>
            <Controller
              name='checkPassword'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input variant='underlined'>
                  <Icon as='AntDesign' name='lock' className='mx-1.5' />
                  <InputField
                    placeholder='请再次输入密码'
                    type={checkPasswordVisible ? 'text' : 'password'}
                    onChangeText={onChange}
                    value={value}
                    keyboardType='number-pad'
                  />
                  {checkPasswordVisible ? (
                    <Icon
                      as='Feather'
                      name='eye'
                      size={20}
                      className='mx-3'
                      onTouchEnd={() => setCheckPasswordVisible(false)}
                    />
                  ) : (
                    <Icon
                      as='Feather'
                      name='eye-off'
                      size={20}
                      className='mx-3'
                      onTouchEnd={() => setCheckPasswordVisible(true)}
                    />
                  )}
                </Input>
              )}
            />
            <FormControlErrorText className='ml-10'>
              {errors?.checkPassword?.message}
            </FormControlErrorText>
          </FormControl>
        )}
        <Button className='mt-4' onTouchEnd={handleSubmit(handleUserSubmit)}>
          <ButtonText>{isRegister ? '注册' : '登录'}</ButtonText>
          {isLoading && (
            <Icon
              as='Feather'
              name='loader'
              className='animate-spin'
              size={18}
            />
          )}
        </Button>
        {!isRegister && (
          <View className='flex-row justify-center mt-6'>
            <Text>新用户？</Text>
            <View onTouchEnd={() => setIsRegister(true)}>
              <Text className='font-bold text-theme-primary'>立即注册</Text>
            </View>
          </View>
        )}
        {isRegister && (
          <Button className='mt-6' onTouchEnd={() => setIsRegister(false)}>
            <ButtonText>返回登录</ButtonText>
          </Button>
        )}
      </View>
    </View>
  );
}
