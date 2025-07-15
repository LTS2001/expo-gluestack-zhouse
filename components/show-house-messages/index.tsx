import {
  BalconyToNameMap,
  FieldToNameMap,
  FieldToUnit,
  KitchenToNameMap,
  ToiletToNameMap,
  TowardToNameMap,
} from '@/constants/house';
import { IHouse, IHouseLease } from '@/global';
import { Text } from '../ui/text';
import { View } from '../ui/view';

interface IProps {
  houses?: IHouse | IHouseLease;
}

const ShowHouseMessage = (props: IProps) => {
  const { houses } = props;
  // 房屋信息展示字段
  const houseMessage = [
    'area',
    'floor',
    'toward',
    'toilet',
    'kitchen',
    'balcony',
    'addressName',
    'addressInfo',
    'note',
  ];

  /**
   * 信息转换
   * @param field 字段
   * @param info 信息
   */
  const infoConvert = (field: string, info: string | number) => {
    if (field === 'toward') {
      return TowardToNameMap[info as keyof typeof TowardToNameMap];
    } else if (field === 'toilet') {
      return ToiletToNameMap[info as keyof typeof ToiletToNameMap];
    } else if (field === 'kitchen') {
      return KitchenToNameMap[info as keyof typeof KitchenToNameMap];
    } else if (field === 'balcony') {
      return BalconyToNameMap[info as keyof typeof BalconyToNameMap];
    } else if (field === 'addressInfo') {
      return `${houses?.provinceName}${houses?.cityName}${houses?.areaName}${info}`;
    }
    return info;
  };

  return (
    <>
      <View className='bg-secondary-50 mx-4 p-4 rounded-xl' needShadow>
        <Text className='text-xl font-bold'>房屋信息</Text>
        {houseMessage.map((item: string, idx: number) => {
          return (
            <View
              key={idx}
              className='flex-row justify-between items-center py-3 border-b-[1px] border-primary-0'
            >
              <Text className='text-lg'>
                {FieldToNameMap[item as keyof typeof FieldToNameMap]}
              </Text>
              <View className='items-center flex-row'>
                <Text
                  className={`text-lg text-end ${
                    ['addressInfo', 'note'].includes(item) ? 'w-52' : ''
                  }`}
                >
                  {infoConvert(item, (houses as any)?.[item])}
                </Text>
                <Text className='text-lg'>
                  {FieldToUnit[item as keyof typeof FieldToUnit]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default ShowHouseMessage;
