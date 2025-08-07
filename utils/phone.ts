import { showToast } from '@/components/ui';
import * as Linking from 'expo-linking';

/**
 * make phone call
 * @param phoneNumber phone number
 */
export const makePhoneCall = async (phoneNumber: string) => {
  try {
    // remove all non-numeric characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (!cleanNumber) {
      showToast({
        title: '无效的电话号码',
        icon: 'error',
      });
      return;
    }

    // use tel: protocol to open phone app
    const url = `tel:${cleanNumber}`;
    const urlWithPlus = `tel:+86${cleanNumber}`;

    // check if the url can be opened
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      // if canOpenURL returns false, try to open the url directly
      try {
        await Linking.openURL(url);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // try the backup url format
        try {
          console.log('tel: try to use backup url open', urlWithPlus);
          await Linking.openURL(urlWithPlus);
        } catch (backupError) {
          console.log('tel: backup url open failed', backupError);
          showToast({
            title: '拨打电话失败',
            icon: 'error',
          });
        }
      }
    }
  } catch (error) {
    console.log('tel: make phone call failed', error);
    showToast({
      title: '拨打电话失败',
      icon: 'error',
    });
  }
};
