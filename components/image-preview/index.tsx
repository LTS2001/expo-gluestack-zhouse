import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { SERVER_ROOT } from '@/constants/image';
import ImageViewer from 'react-native-image-zoom-viewer';
interface IProps {
  srcs?: string | string[];
  visible?: boolean;
  onClose?: () => void;
  index?: number;
}
const ImagePreview = ({ srcs: _srcs, visible, onClose, index }: IProps) => {
  const srcs = typeof _srcs === 'string' ? [_srcs] : _srcs;
  return (
    <AlertDialog isOpen={visible}>
      <AlertDialogContent className='p-0 h-full border-black' size='full'>
        <ImageViewer
          imageUrls={srcs?.map((s) => ({ url: SERVER_ROOT + s }))}
          onClick={onClose}
          index={index}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImagePreview;
