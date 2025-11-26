import { webrtcStore } from '@/stores';
import { formatVideoDuration } from '@/utils';
import { observer } from 'mobx-react-lite';
import { Text } from '../ui';

function WebrtcTimer() {
  const { callDuration } = webrtcStore;
  return (
    <Text className='text-white text-xl tracking-[2px]'>
      {formatVideoDuration(callDuration * 1000)}
    </Text>
  );
}

export default observer(WebrtcTimer);
