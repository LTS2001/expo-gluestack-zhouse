import { Image, Text, TouchableOpacity, View } from '@/components/ui';
import { formatUtcTime } from '@/utils';
import { observer } from 'mobx-react-lite';
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

function TenantHouseCard(props: IProps) {
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
    statusBg = 'var(--mini-first)',
    isStatusSlot,
    StatusSlotComponent,
    className,
  } = props;

  /**
   * 点击房屋详情内容
   */
  const clickHouseContent = () => {
    toLookHouse && toLookHouse();
  };

  return (
    <View
      className={`mb-5 pt-3 px-4 pb-4 rounded-lg bg-background-0 ${className}`}
      needShadow
    >
      <Text className='text-2xl font-bold mb-2'>{houseName}</Text>
      {isShowLandlord ? (
        <View className='home-landlord-info'>
          <View className='flex items-center'>
            <Image src={landlordImg} className='landlord-head-img' />
            <Text className='landlord-text'>{landlordName}</Text>
          </View>
        </View>
      ) : null}
      <TouchableOpacity
        className='flex-row items-center'
        onPress={clickHouseContent}
      >
        <Image
          src={houseImg}
          className='w-[144px] h-[90px] rounded-md'
          needShadow
        />
        <View className='flex-1 ml-4 gap-2'>
          <View className='flex-row items-center'>
            <Text>状态：</Text>
            {isStatusSlot ? (
              StatusSlotComponent
            ) : (
              <Tag content={statusText} bgColor={statusBg} />
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
      </TouchableOpacity>
      <View className='flex-row items-center mt-3'>
        <Text>地址：</Text>
        <Text className='info-address'>{address}</Text>
      </View>
      {isFooterSlot ? FooterSlotComponent : null}
    </View>
  );
}

export default observer(TenantHouseCard);
