import { showToast } from '@/components/ui';
import { useState } from 'react';

export default function useRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = (
    executeRefresh: () => Promise<any>,
    options?: {
      successTitle?: string;
      toastVisible?: boolean;
    }
  ) => {
    const { successTitle = '刷新成功！', toastVisible = true } = options || {};
    return async () => {
      setRefreshing(true);
      await executeRefresh();
      setRefreshing(false);
      toastVisible &&
        showToast({
          title: successTitle,
          icon: 'success',
        });
    };
  };

  return {
    refreshing,
    onRefresh,
  };
}
