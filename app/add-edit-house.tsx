import { getLandlordHouseList } from '@/business';
import { Tag, UploadImages } from '@/components';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlErrorText,
  Icon,
  Input,
  InputField,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
  showToast,
  Text,
  Textarea,
  TextareaInput,
  TouchableOpacity,
  View,
} from '@/components/ui';
import emitter, { EEventNameEnum } from '@/emitter';
import { ITencentMapLocation } from '@/global';
import { useKeyboardHeight } from '@/hooks';
import { postHouseApi, putHouseApi } from '@/request';
import { houseStore } from '@/stores';
import { zodResolver } from '@hookform/resolvers/zod';
import cls from 'classnames';
import { router, useNavigation } from 'expo-router';
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
  onPress?: () => void;
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
                          <TouchableOpacity onPress={c.onPress}>
                            <Input>
                              {c.leftSlot && (
                                <View className='ml-2'>{c.leftSlot}</View>
                              )}
                              <InputField
                                onChangeText={onChange}
                                value={value as string}
                                placeholder={
                                  halfWidth ? '' : `请输入${c.label}`
                                }
                              />
                              {c.rightSlot && (
                                <View className='mr-2'>{c.rightSlot}</View>
                              )}
                            </Input>
                          </TouchableOpacity>
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
  const { currentHouse } = houseStore;
  const navigation = useNavigation();
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
      note: '',
    },
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const { keyboardHeight } = useKeyboardHeight();
  const [chooseLocation, setChooseLocation] = useState<ITencentMapLocation>();
  useEffect(() => {
    emitter.on(EEventNameEnum.GetLocation, (data) => {
      form.setValue('addressName', data.poiname);
      form.setValue('addressDetail', data.poiaddress);
      setChooseLocation(data);
    });
    return () => {
      emitter.off(EEventNameEnum.GetLocation);
    };
  }, [form]);

  useEffect(() => {
    navigation.setOptions({
      title: currentHouse ? '编辑房屋' : '新增房屋',
    });
  }, [currentHouse, navigation]);

  useEffect(() => {
    if (currentHouse) {
      form.setValue('name', currentHouse.name);
      form.setValue('price', currentHouse.price.toString());
      form.setValue('waterFee', currentHouse.waterFee.toString());
      form.setValue('electricityFee', currentHouse.electricityFee.toString());
      form.setValue('internetFee', currentHouse.internetFee.toString());
      form.setValue('fuelFee', currentHouse.fuelFee.toString());
      form.setValue('depositNumber', currentHouse.depositNumber.toString());
      form.setValue('priceNumber', currentHouse.priceNumber.toString());
      form.setValue('area', currentHouse.area.toString());
      form.setValue('floor', currentHouse.floor.toString());
      form.setValue('toward', currentHouse.toward.toString());
      form.setValue('toilet', currentHouse.toilet.toString());
      form.setValue('kitchen', currentHouse.kitchen.toString());
      form.setValue('balcony', currentHouse.balcony.toString());
      form.setValue('addressName', currentHouse.addressName);
      form.setValue(
        'addressDetail',
        `${currentHouse.provinceName}${currentHouse.cityName}${currentHouse.areaName}${currentHouse.addressInfo}`
      );
      form.setValue('note', currentHouse.note || '');
      form.setValue('houseImg', JSON.parse(currentHouse.houseImg));
    }
  }, [currentHouse, form]);

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
        <TouchableOpacity
          className='px-3 py-1'
          onPress={() =>
            router.push({
              pathname: '/choose-location',
              params: {
                eventName: EEventNameEnum.GetLocation,
              },
            })
          }
        >
          <Icon as='Octicons' name='location' size={22} />
        </TouchableOpacity>
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
      render: ({ field: { onChange, value } }) => (
        <UploadImages value={value as string[]} onChange={onChange} />
      ),
    },
  ];

  const onFinish = async (value: TFormSchema) => {
    try {
      const formData = {
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
        longitude: Number(chooseLocation?.latlng?.lng),
        latitude: Number(chooseLocation?.latlng?.lat),
        houseImg: JSON.stringify(value.houseImg),
      };
      if (currentHouse) {
        await putHouseApi({
          ...value,
          ...formData,
          houseId: currentHouse.houseId,
          addressId: currentHouse.addressId,
        });
      } else {
        await postHouseApi({
          ...value,
          ...formData,
        });
      }
      showToast({
        title: '提交成功',
        icon: 'success',
      });
      await getLandlordHouseList();
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
    <ScrollView
      ref={scrollViewRef}
      className='p-4 bg-background-0 flex-1'
      showsVerticalScrollIndicator={false}
    >
      <FormProvider {...form}>
        <GenerateForm config={formConfig} />
      </FormProvider>
      <View
        style={{
          paddingBottom: keyboardHeight + 80,
        }}
      >
        <Button className='mt-8' onPress={form.handleSubmit(onFinish)}>
          <ButtonText>保存</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default observer(AddEditHouse);
