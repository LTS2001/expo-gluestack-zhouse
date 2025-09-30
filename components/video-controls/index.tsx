import { formatVideoDuration } from '@/utils';
import { useEvent } from 'expo';
import { VideoPlayer } from 'expo-video';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon, Text, TouchableOpacity, View } from '../ui';
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '../ui/slider';
interface IProps {
  player: VideoPlayer;
}

export default function VideoControls(props: IProps) {
  const { player } = props;
  const sliderChangeValRef = useRef(0);
  const prevRoundedCurrentTime = useRef(0);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [progressTipVisible, setProgressTipVisible] = useState(false);
  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    currentLiveTimestamp: player.currentLiveTimestamp,
    currentOffsetFromLive: player.currentOffsetFromLive,
    bufferedPosition: player.bufferedPosition,
  });
  const { status } = useEvent(player, 'statusChange', {
    status: player.status,
  });
  useEffect(() => {
    if (status === 'readyToPlay') {
      player.timeUpdateEventInterval = 0.5;
    } else {
      player.timeUpdateEventInterval = 0;
    }
  }, [player, status, isPlaying]);

  const { formattedCurrentTime, roundedCurrentTime } = useMemo(
    () => ({
      formattedCurrentTime: formatVideoDuration(currentTime * 1000),
      roundedCurrentTime: Math.round(currentTime),
    }),
    [currentTime]
  );
  const { formattedDuration, roundedDuration } = useMemo(
    () => ({
      formattedDuration: formatVideoDuration(player.duration * 1000),
      roundedDuration: Math.round(player.duration),
    }),
    [player.duration]
  );

  useEffect(() => {
    if (!isTouchActive) {
      sliderChangeValRef.current = roundedCurrentTime;
    }
    prevRoundedCurrentTime.current = roundedCurrentTime;
  }, [isTouchActive, roundedCurrentTime]);
  const isPlayEnd = useMemo(
    () => roundedCurrentTime >= roundedDuration,
    [roundedCurrentTime, roundedDuration]
  );
  const sliderVal = isTouchActive
    ? sliderChangeValRef.current
    : roundedCurrentTime;

  return (
    <View className='absolute inset-0 z-50'>
      <View className='absolute bottom-0 left-0 right-0 h-52 gap-8'>
        <View className='h-20 '>
          <View
            className='flex-row justify-center gap-2'
            style={{ display: progressTipVisible ? 'flex' : 'none' }}
          >
            <Text className='text-white text-lg'>{formatVideoDuration(sliderVal * 1000)}</Text>
            <Text>/</Text>
            <Text className='text-lg'>{formattedDuration}</Text>
          </View>
        </View>
        <View className='flex-row items-center gap-2 px-3'>
          {!isPlaying ? (
            <TouchableOpacity
              onPress={() => {
                if (isPlayEnd) {
                  player.currentTime = 0;
                }
                player.play();
              }}
            >
              <Icon
                as='Entypo'
                name='controller-play'
                size={44}
                color='white'
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                player.pause();
              }}
            >
              <Icon
                as='Entypo'
                name='controller-paus'
                size={44}
                color='white'
              />
            </TouchableOpacity>
          )}
          <View className='flex-1 relative'>
            <View className='flex-row items-center justify-between absolute -top-8'>
              <View className='flex-row items-center gap-1'>
                <Text>{formattedCurrentTime}</Text>
                <Text>/</Text>
                <Text>{formattedDuration}</Text>
              </View>
            </View>
            <View
              onTouchEnd={() => {
                player.currentTime = sliderChangeValRef.current;
                setIsTouchActive(false);
                setProgressTipVisible(false);
                setProgressTipVisible(false);
              }}
              onTouchStart={() => {
                setIsTouchActive(true);
                setProgressTipVisible(true);
                setProgressTipVisible(true);
              }}
            >
              <Slider
                size='lg'
                orientation='horizontal'
                isDisabled={false}
                isReversed={false}
                value={sliderVal}
                minValue={0}
                maxValue={roundedDuration}
                onChange={(value) => {
                  sliderChangeValRef.current = value;
                }}
              >
                <SliderTrack className='bg-primary-50'>
                  <SliderFilledTrack className='bg-secondary-0' />
                </SliderTrack>
                <SliderThumb className='bg-secondary-0' size='xs' />
              </Slider>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
