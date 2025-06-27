import Tag from '@/components/tag';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { showToast } from '@/components/ui/toast';
import { View } from '@/components/ui/view';
import { zodResolver } from '@hookform/resolvers/zod';
import cls from 'classnames';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FormProvider,
  useForm,
  useFormContext,
  UseFormStateReturn,
} from 'react-hook-form';
import { ScrollView } from 'react-native';
import { z } from 'zod';
const formSchema = z.object({
  // base info
  name: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  price: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),

  // fee info
  waterFee: z
    .number({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  electricityFee: z
    .number({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  internetFee: z
    .number({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  fuelFee: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  depositNumber: z
    .number({ required_error: '必填项' })
    .min(0, { message: '必填项' }),
  priceNumber: z
    .number({ required_error: '必填项' })
    .min(0, { message: '必填项' }),

  // house info
  area: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  floor: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  toward: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  toilet: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  kitchen: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),
  balcony: z.number({ required_error: '必填项' }).min(1, { message: '必填项' }),

  // address info
  addressName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  addressDetail: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  provinceName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  cityName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  areaName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  addressInfo: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),

  // other info
  note: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
});

type TFormSchema = z.infer<typeof formSchema>;

interface IFormConfig {
  label?: string;
  name?: keyof TFormSchema;
  render?: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFormSchema, keyof TFormSchema>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<TFormSchema>;
  }) => React.ReactElement;
  type?: 'input' | 'radio';
  options?: { label: string; value: string }[];
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  sector?: IFormConfig[];
}
const GenerateForm = ({ config }: { config: IFormConfig[] }) => {
  // useFormContext() will get the control and formState (including errors) from the parent component through FormProvider.
  const {
    control,
    formState: { errors },
  } = useFormContext<TFormSchema>();

  // 渲染单个表单项
  const renderFormItem = (c: IFormConfig, halfWidth: boolean = false) => {
    return (
      <FormControl
        key={c.name}
        className={cls({
          'flex-1': halfWidth,
        })}
      >
        <View className={`flex-row items-center my-3`}>
          {c.label && <Text className='text-xl mr-2'>{c.label}：</Text>}
          {c.name && (
            <View className='flex-1 relative'>
              <Controller
                name={c.name}
                control={control}
                render={({ field: { onChange, value } }) =>
                  c.type === 'radio' ? (
                    <RadioGroup
                      value={value as string}
                      onChange={onChange}
                      className='flex-row gap-5'
                    >
                      {c.options?.map((opt) => (
                        <Radio key={opt.value} value={opt.value} size='lg'>
                          <RadioIndicator>
                            <RadioIcon
                              as='Entypo'
                              name='controller-record'
                              size={16}
                              lightColor='black'
                              darkColor='white'
                            />
                          </RadioIndicator>
                          <RadioLabel>{opt.label}</RadioLabel>
                        </Radio>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Input>
                      {c.leftSlot && <View className='ml-2'>{c.leftSlot}</View>}
                      <InputField
                        onChangeText={onChange}
                        value={
                          typeof value === 'string' || typeof value === 'number'
                            ? String(value)
                            : ''
                        }
                        placeholder={halfWidth ? '' : `请输入${c.label}`}
                      />
                      {c.rightSlot && (
                        <View className='mr-2'>{c.rightSlot}</View>
                      )}
                    </Input>
                  )
                }
              />
              <FormControlErrorText className='absolute -bottom-6'>
                {c.name ? errors[c.name]?.message : ''}
              </FormControlErrorText>
            </View>
          )}
        </View>
      </FormControl>
    );
  };

  return (
    <>
      {config.map((c, idx) => {
        if (c.sector && Array.isArray(c.sector)) {
          // sector exists, render a row, each item takes up half the width
          return (
            <View key={c.name ?? `sector-${idx}`}>
              {c.label && <Text className='text-xl mt-2'>{c.label}：</Text>}
              <View className='flex-row gap-5'>
                {c.sector.map((item) => renderFormItem(item, true))}
              </View>
            </View>
          );
        } else {
          return renderFormItem(c);
        }
      })}
    </>
  );
};

const AddEditHouse = () => {
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
  });

  const formConfig: IFormConfig[] = [
    // base info
    {
      label: '名称',
      name: 'name',
    },
    {
      label: '租金',
      name: 'price',
      leftSlot: <Tag content='$' />,
    },

    // fee info
    {
      label: '其他费用',
      sector: [
        {
          name: 'waterFee',
          leftSlot: <Tag content='水' />,
          rightSlot: <Text className='text-primary-100'>元/吨</Text>,
        },
        {
          name: 'electricityFee',
          leftSlot: <Tag content='电' bgColor='bg-theme-secondary' />,
          rightSlot: <Text className='text-primary-100'>元/度</Text>,
        },
      ],
    },
    {
      sector: [
        {
          name: 'internetFee',
          leftSlot: <Tag content='网' bgColor='bg-theme-tertiary' />,
          rightSlot: <Text className='text-primary-100'>元/月</Text>,
        },
        {
          name: 'fuelFee',
          leftSlot: <Tag content='燃气' />,
          rightSlot: <Text className='text-primary-100'>元/m³</Text>,
        },
      ],
    },
    {
      label: '付款方式',
      sector: [
        {
          name: 'priceNumber',
          leftSlot: <Text className='text-primary-100 text-lg'>押:</Text>,
          rightSlot: <Tag content='月' />,
        },
        {
          name: 'depositNumber',
          leftSlot: <Text className='text-primary-100 text-lg'>付:</Text>,
          rightSlot: <Tag content='月' bgColor='bg-theme-tertiary' />,
        },
      ],
    },

    // house info
    {
      label: '房屋信息',
      sector: [
        {
          name: 'area',
          leftSlot: <Text className='text-primary-100 text-lg'>面积:</Text>,
          rightSlot: <Tag content='方' />,
        },
        {
          name: 'floor',
          leftSlot: <Text className='text-primary-100 text-lg'>楼层:</Text>,
          rightSlot: <Tag content='层' bgColor='bg-theme-tertiary' />,
        },
      ],
    },
    {
      label: '朝向',
      name: 'toward',
      type: 'radio',
      options: [
        { label: '东', value: '东' },
        { label: '西', value: '西' },
        { label: '南', value: '南' },
        { label: '北', value: '北' },
      ],
    },
    {
      label: '卫生间',
      name: 'toilet',
      type: 'radio',
      options: [
        { label: '没有', value: '没有' },
        { label: '独立', value: '独立' },
        { label: '公用', value: '公用' },
      ],
    },
    {
      label: '厨房',
      name: 'kitchen',
      type: 'radio',
      options: [
        { label: '没有', value: '没有' },
        { label: '独立', value: '独立' },
        { label: '公用', value: '公用' },
      ],
    },
    {
      label: '阳台',
      name: 'balcony',
      type: 'radio',
      options: [
        { label: '有', value: '有' },
        { label: '无', value: '无' },
      ],
    },

    // address info
    {
      label: '地址名称',
      name: 'addressName',
    },
    {
      label: '详细地址',
      name: 'addressDetail',
    },
    {
      label: '省份',
      name: 'provinceName',
    },
    {
      label: '城市',
      name: 'cityName',
    },
    {
      label: '区域',
      name: 'areaName',
    },
    {
      label: '地址信息',
      name: 'addressInfo',
    },

    // other info
    {
      label: '备注',
      name: 'note',
    },
  ];

  const onFinish = async (value: TFormSchema) => {
    // const res = await addHouse({
    //   ...value,
    //   longitude: Number(value.longitude),
    //   latitude: Number(value.latitude),
    // });
    // console.log(res);
    try {
      console.log('表单数据:', value);
      showToast({
        title: '提交成功',
        icon: 'success',
      });
      router.back();
    } catch (error) {
      console.error('提交失败:', error);
      showToast({
        title: '提交失败',
        icon: 'error',
      });
    }
  };

  return (
    <ScrollView className='p-4 bg-background-0 flex-1'>
      <FormProvider {...form}>
        <GenerateForm config={formConfig} />
      </FormProvider>
      <Button className='mt-8' onTouchEnd={form.handleSubmit(onFinish)}>
        <ButtonText>提交</ButtonText>
      </Button>
    </ScrollView>
  );
};

export default observer(AddEditHouse);
