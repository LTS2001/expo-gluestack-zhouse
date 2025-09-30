import { useVideoPlayer, VideoView } from 'expo-video';
import { Dimensions } from 'react-native';
import { AlertDialog, AlertDialogBackdrop } from '../ui';

interface IProps {
  source: string;
  aspectRatio: number;
  isOpen: boolean;
}

export default function VideoPreview(props: IProps) {
  const { source, aspectRatio, isOpen } = props;
  const player = useVideoPlayer(source, (player) => {
    player.play();
  });

  return (
    <AlertDialog isOpen={isOpen} className='w-full h-full'>
      <AlertDialogBackdrop
        animate={{
          opacity: 1,
        }}
      />
      <VideoView
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width / aspectRatio,
        }}
        player={player}
        contentFit='cover'
        fullscreenOptions={{
          enable: false,
        }}
        nativeControls={true}
      />
      {/* <VideoControls player={player} /> */}
    </AlertDialog>
  );
}
