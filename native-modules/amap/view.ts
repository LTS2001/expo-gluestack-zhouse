import { ICenter, ISearchMapPoi } from '@/app/amap';
import { requireNativeComponent, StyleProp, ViewStyle } from 'react-native';

export interface AMapViewProps {
  style?: StyleProp<ViewStyle>;
  onPoiSearchStart?: () => void;
  onPoiSearch?: (e: {
    nativeEvent: { pois: ISearchMapPoi[]; center: ICenter };
  }) => void;
}

export default requireNativeComponent<AMapViewProps>('AMapView');
