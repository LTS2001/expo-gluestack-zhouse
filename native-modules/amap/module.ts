import { NativeModules } from 'react-native';

const { AMapSearchModule } = NativeModules;

export const searchPoi = (
  latitude: number,
  longitude: number,
  pageNum: number,
) => {
  return AMapSearchModule.searchPoi(latitude, longitude, pageNum);
};
