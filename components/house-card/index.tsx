import { Image, Text, TouchableOpacity, View } from '@/components/ui';
import { ASPECT_RATIO } from '@/constants';
import { formatUtcTime } from '@/utils';
import { observer } from 'mobx-react-lite';
import { Dimensions } from 'react-native';
import Tag from '../tag';

interface IProps {
  houseName: string;
  isShowLandlord?: boolean;
  landlordImg?: string;
  landlordName?: string;
  toLookHouse?: () => void;
  houseImg: string;
  housePrice: number;
  date: Date | string;
  dateText: string;
  address: string;
  isFooterSlot?: boolean;
  FooterSlotComponent?: React.ReactNode;
  isStatusSlot?: boolean;
  StatusSlotComponent?: React.ReactNode;
  statusText?: string;
  statusBg?: string;
  className?: string;
}

function HouseCard(props: IProps) {
  const {
    houseName,
    isShowLandlord = true,
    landlordImg,
    landlordName,
    toLookHouse,
    houseImg,
    housePrice,
    date,
    dateText,
    address,
    isFooterSlot,
    FooterSlotComponent,
    statusText = '',
    statusBg,
    isStatusSlot,
    StatusSlotComponent,
    className,
  } = props;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = (screenWidth - 64) * 0.42;
  return (
    <TouchableOpacity onPress={() => toLookHouse?.()}>
      <View
        className={`mx-4 p-4 rounded-lg bg-background-0 ${className}`}
        needShadow
      >
        <Text className='text-2xl font-bold mb-2'>{houseName}</Text>
        {isShowLandlord ? (
          <View className='flex-row items-center gap-2 mb-3'>
            <Image src={landlordImg} size='3xs' className='rounded-full' />
            <Text className=''>{landlordName}</Text>
          </View>
        ) : null}
        <View className='flex-row items-center'>
          <Image
            src={houseImg}
            className='rounded-md'
            style={{
              width: imageWidth,
              height: imageWidth / ASPECT_RATIO,
            }}
            needShadow
          />
          <View className='flex-1 ml-4 gap-2'>
            <View className='flex-row items-center'>
              <Text>状态：</Text>
              {isStatusSlot ? (
                StatusSlotComponent
              ) : (
                <Tag content={statusText} bgColor={statusBg} expand />
              )}
            </View>
            <View className='flex-row items-center'>
              <Text>租金：</Text>
              <Text className='font-bold text-error-700 text-lg'>
                ￥{housePrice}
              </Text>
            </View>
            <View className='flex-row items-center'>
              <Text>{dateText}</Text>
              <Text>{formatUtcTime(date, 'day')}</Text>
            </View>
          </View>
        </View>
        <View className='flex-row items-center mt-3'>
          <Text>地址：</Text>
          <Text className='info-address'>{address}</Text>
        </View>
        {isFooterSlot ? FooterSlotComponent : null}
      </View>
    </TouchableOpacity>
  );
}

export default observer(HouseCard);
