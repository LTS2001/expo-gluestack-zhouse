import { Text, View } from '@/components/ui';
import { FieldToNameMap, FieldToUnit } from '@/constants';
import { IHouse, IHouseLease } from '@/global';

interface IProps {
  houses?: IHouseLease | IHouse;
}

const ShowCollectFees = (props: IProps) => {
  const { houses } = props;
  // 房屋收费标准展示字段
  const collectFees = [
    'price',
    'waterFee',
    'electricityFee',
    'internetFee',
    'fuelFee',
    'depositNumber',
    'priceNumber',
  ];

  return (
    <>
      <View className='bg-secondary-50 mx-4 p-4 rounded-xl' needShadow>
        <Text className='text-xl font-bold'>收费标准</Text>
        {collectFees.map((item: string, idx: number) => {
          return (
            <View
              key={idx}
              className='flex-row justify-between items-center py-3 border-b-[1px] border-primary-0'
            >
              <Text className='text-lg'>
                {FieldToNameMap[item as keyof typeof FieldToNameMap]}
              </Text>
              <View className='flex-row items-center'>
                <Text className='text-lg font-bold text-error-700'>
                  {item !== 'priceNumber' && item !== 'depositNumber'
                    ? '￥'
                    : null}
                  {houses && (houses as any)[item]}
                </Text>
                <Text className='unit'>
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

export default ShowCollectFees;
