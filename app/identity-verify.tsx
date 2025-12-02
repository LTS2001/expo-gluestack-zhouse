import { getUserInfo, uploadIdentityCardImage } from '@/business';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlErrorText,
  Icon,
  Image,
  Input,
  InputField,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  showToast,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { putUserApi } from '@/request';
import { formatUtcTime } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
  UseFormStateReturn,
} from 'react-hook-form';
import { z } from 'zod';
const formSchema = z.object({
  identityName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identitySex: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityBorn: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityNation: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityAddress: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityNumber: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityImgFront: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  identityImgBack: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
});
type TFormSchema = z.infer<typeof formSchema>;
interface IFormConfig {
  label: string;
  name: keyof TFormSchema;
  render?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFormSchema, keyof TFormSchema>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFormSchema>;
  }) => React.ReactElement;
}
const IdentityVerify = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });
  const [bornVisible, setBornVisible] = useState(false);

  const uploadIdCard = async (onChange: (...event: any[]) => void) => {
    const url = await uploadIdentityCardImage();
    onChange(url);
  };

  const formConfig: IFormConfig[] = [
    {
      label: '姓名',
      name: 'identityName',
    },
    {
      label: '性别',
      name: 'identitySex',
      render: ({ field: { onChange, value } }) => (
        <RadioGroup onChange={onChange} value={value} className='flex-row'>
          <Radio value='1' size='lg'>
            <RadioIndicator>
              <RadioIcon
                as='Entypo'
                name='controller-record'
                size={16}
                lightColor='black'
                darkColor='white'
              />
            </RadioIndicator>
            <RadioLabel>男</RadioLabel>
          </Radio>
          <Radio value='0' size='lg'>
            <RadioIndicator>
              <RadioIcon
                as='Entypo'
                name='controller-record'
                size={16}
                lightColor='black'
                darkColor='white'
              />
            </RadioIndicator>
            <RadioLabel>女</RadioLabel>
          </Radio>
        </RadioGroup>
      ),
    },
    {
      label: '出生日期',
      name: 'identityBorn',
      render: ({ field: { onChange, value } }) =>
        bornVisible ? (
          <DateTimePicker
            onChange={(_, date) => {
              onChange(formatUtcTime(date, 'day'));
              setBornVisible(false);
            }}
            maximumDate={new Date()}
            value={value ? new Date(value) : new Date()}
          />
        ) : (
          <Input
            variant='underlined'
            isDisabled={true}
            onTouchEnd={() => setBornVisible(true)}
          >
            <InputField
              value={value}
              placeholder={`请选择出生日期`}
              className='text-lg'
            ></InputField>
          </Input>
        ),
    },
    {
      label: '民族',
      name: 'identityNation',
    },
    {
      label: '住址',
      name: 'identityAddress',
    },
    {
      label: '身份证号码',
      name: 'identityNumber',
    },
    {
      label: '身份证正面',
      name: 'identityImgFront',
      render: ({ field: { onChange, value } }) => (
        <TouchableOpacity
          className='relative w-32 h-20'
          onPress={() => {
            uploadIdCard(onChange);
          }}
        >
          {!value ? (
            <>
              <Image
                source={require('@/assets/images/idcard-front.png')}
                className='w-32 h-20'
              />
              <Icon
                as='AntDesign'
                name='plus'
                size={36}
                lightColor='balck'
                darkColor='white'
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              />
            </>
          ) : (
            <Image src={value} className='w-32 h-20' />
          )}
        </TouchableOpacity>
      ),
    },
    {
      label: '身份证反面',
      name: 'identityImgBack',
      render: ({ field: { onChange, value } }) => (
        <TouchableOpacity
          className='relative w-32 h-20'
          onPress={() => {
            uploadIdCard(onChange);
          }}
        >
          {!value ? (
            <>
              <Image
                source={require('@/assets/images/idcard-back.png')}
                className='w-32 h-20'
              />
              <Icon
                as='AntDesign'
                name='plus'
                size={36}
                lightColor='balck'
                darkColor='white'
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              />
            </>
          ) : (
            <Image src={value} className='w-32 h-20' />
          )}
        </TouchableOpacity>
      ),
    },
  ];

  const onFinish = async (value: TFormSchema) => {
    const { identityImgFront, identityImgBack, identitySex, ..._vals } = value;
    await putUserApi({
      ..._vals,
      identitySex: Number(identitySex),
      identityImg: JSON.stringify([identityImgFront, identityImgBack]),
    });
    showToast({
      title: '实名成功',
      icon: 'success',
    });
    await getUserInfo();
    router.back();
  };

  return (
    <View className='p-4 bg-background-0 flex-1'>
      {formConfig.map((c, idx) => {
        return (
          <FormControl key={idx}>
            <View className='flex-row items-center my-3'>
              <Text className='text-xl mr-2'>{c.label}：</Text>
              <View className='flex-1 relative'>
                <Controller
                  name={c.name}
                  control={control}
                  render={
                    c.render
                      ? c.render
                      : ({ field: { onChange, value } }) => (
                          <Input variant='underlined'>
                            <InputField
                              onChangeText={onChange}
                              value={value}
                              placeholder={`请输入${c.label}`}
                              className='text-lg'
                            ></InputField>
                          </Input>
                        )
                  }
                />
                <FormControlErrorText className='absolute -bottom-6'>
                  {errors[c.name]?.message}
                </FormControlErrorText>
              </View>
            </View>
          </FormControl>
        );
      })}
      <Button className='mt-8' onPress={handleSubmit(onFinish)}>
        <ButtonText>认证</ButtonText>
      </Button>
    </View>
  );
};
export default observer(IdentityVerify);
