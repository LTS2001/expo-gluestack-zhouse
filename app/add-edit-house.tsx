import ImagePreview from '@/components/image-preview';
import Tag from '@/components/tag';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlErrorText,
} from '@/components/ui/form-control';
import { Icon } from '@/components/ui/icon';
import { Image } from '@/components/ui/image';
import { Input, InputField } from '@/components/ui/input';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/components/ui/radio';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { showToast } from '@/components/ui/toast';
import { View } from '@/components/ui/view';
import { useTool } from '@/hooks/useTool';
import useUpload from '@/hooks/useUpload';
import { addHouse } from '@/request/api/house';
import locationStore from '@/stores/location';
import { zodResolver } from '@hookform/resolvers/zod';
import cls from 'classnames';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
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
  price: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  houseImg: z.array(z.string({ required_error: '必填项' })).min(1, {
    message: '必填项',
  }),

  // fee info
  waterFee: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  electricityFee: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  internetFee: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  fuelFee: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  depositNumber: z
    .string({ required_error: '必填项' })
    .min(0, { message: '必填项' }),
  priceNumber: z
    .string({ required_error: '必填项' })
    .min(0, { message: '必填项' }),

  // house info
  area: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  floor: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  toward: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  toilet: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  kitchen: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),
  balcony: z.string({ required_error: '必填项' }).min(1, { message: '必填项' }),

  // address info
  addressName: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),
  addressDetail: z
    .string({ required_error: '必填项' })
    .min(1, { message: '必填项' }),

  // other info
  note: z.string().optional(),
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
  onTouchEnd?: () => void;
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
                render={
                  c.render
                    ? c.render
                    : ({ field: { onChange, value } }) =>
                        c.type === 'radio' ? (
                          <RadioGroup
                            value={value?.toString()}
                            onChange={onChange}
                            className='flex-row gap-5'
                          >
                            {c.options?.map((opt) => (
                              <Radio
                                key={opt.value}
                                value={opt.value?.toString()}
                                size='lg'
                              >
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
                          <Input onTouchEnd={c.onTouchEnd}>
                            {c.leftSlot && (
                              <View className='ml-2'>{c.leftSlot}</View>
                            )}
                            <InputField
                              onChangeText={onChange}
                              value={value as string}
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
  const { title, address, setTitle, setAddress, latitude, longitude } =
    locationStore;
  const form = useForm<TFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      waterFee: '3',
      electricityFee: '0.7',
      internetFee: '0',
      fuelFee: '0',
      depositNumber: '1',
      priceNumber: '1',
      toward: '3',
      toilet: '2',
      kitchen: '2',
      balcony: '2',
    },
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const [imagePreview, setImagePreview] = useState<{
    visible: boolean;
    index: number;
  }>({
    visible: false,
    index: 0,
  });
  const { keyboardHeight } = useTool();
  const { uploadImage } = useUpload();
  useEffect(() => {
    form.setValue('addressName', title);
    form.setValue('addressDetail', address);
  }, [title, address, form]);

  useEffect(() => {
    setTitle('');
    setAddress('');
  }, [setTitle, setAddress]);

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
        { label: '东', value: '1' },
        { label: '西', value: '2' },
        { label: '南', value: '3' },
        { label: '北', value: '4' },
      ],
    },
    {
      label: '卫生间',
      name: 'toilet',
      type: 'radio',
      options: [
        { label: '没有', value: '1' },
        { label: '独立', value: '2' },
        { label: '公用', value: '3' },
      ],
    },
    {
      label: '厨房',
      name: 'kitchen',
      type: 'radio',
      options: [
        { label: '没有', value: '1' },
        { label: '独立', value: '2' },
        { label: '公用', value: '3' },
      ],
    },
    {
      label: '阳台',
      name: 'balcony',
      type: 'radio',
      options: [
        { label: '有', value: '1' },
        { label: '无', value: '2' },
      ],
    },

    // address info
    {
      label: '地址名称',
      name: 'addressName',
      rightSlot: (
        <View
          className='px-3 py-1'
          onTouchEnd={() => router.push('/choose-location')}
        >
          <Icon as='Octicons' name='location' size={22} />
        </View>
      ),
    },
    {
      label: '详细地址',
      name: 'addressDetail',
    },
    // other info
    {
      label: '备注',
      name: 'note',
      render: ({ field: { onChange, value } }) => (
        <Textarea
          onTouchEnd={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
        >
          <TextareaInput
            placeholder='请输入备注'
            onChangeText={onChange}
            value={value as string}
          />
        </Textarea>
      ),
    },
    {
      label: '图片',
      name: 'houseImg',
      render: ({ field: { onChange, value } }) => {
        return (
          <View className='flex-row flex-wrap gap-4'>
            {/* image list */}
            {value && Array.isArray(value) && value.length > 0
              ? value.map((item, index) => (
                  <View
                    key={index}
                    onTouchEnd={() => {
                      setImagePreview({
                        visible: true,
                        index,
                      });
                    }}
                  >
                    <Image
                      src={item}
                      className='w-32 h-20 rounded-md border-[1px] border-secondary-300'
                    />
                  </View>
                ))
              : null}
            {/* add image */}
            <View
              className='w-32 h-20 bg-secondary-300 flex justify-center items-center rounded-md'
              onTouchEnd={async () => {
                const res = await uploadImage({
                  allowsEditing: true,
                  aspect: [16, 10],
                });
                if (value instanceof Array) {
                  onChange([...value, res]);
                } else {
                  onChange([res]);
                }
              }}
            >
              <Icon as='AntDesign' name='plus' size={24} />
            </View>
            {/* image preview */}
            <ImagePreview
              srcs={value}
              visible={imagePreview.visible}
              onClose={() =>
                setImagePreview({
                  visible: false,
                  index: 0,
                })
              }
              index={imagePreview.index}
            />
          </View>
        );
      },
    },
  ];

  const onFinish = async (value: TFormSchema) => {
    try {
      await addHouse({
        ...value,
        price: Number(value.price),
        waterFee: Number(value.waterFee),
        electricityFee: Number(value.electricityFee),
        internetFee: Number(value.internetFee),
        fuelFee: Number(value.fuelFee),
        depositNumber: Number(value.depositNumber),
        priceNumber: Number(value.priceNumber),
        area: Number(value.area),
        floor: Number(value.floor),
        toward: Number(value.toward),
        toilet: Number(value.toilet),
        kitchen: Number(value.kitchen),
        balcony: Number(value.balcony),
        longitude: Number(longitude),
        latitude: Number(latitude),
        houseImg: JSON.stringify(value.houseImg),
      });
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
    <ScrollView ref={scrollViewRef} className='p-4 bg-background-0 flex-1'>
      <FormProvider {...form}>
        <GenerateForm config={formConfig} />
      </FormProvider>
      <View
        style={{
          paddingBottom: keyboardHeight + 80,
        }}
      >
        <Button className='mt-8' onTouchEnd={form.handleSubmit(onFinish)}>
          <ButtonText>保存</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default observer(AddEditHouse);
