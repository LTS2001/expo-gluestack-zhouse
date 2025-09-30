import { showToast } from '@/components/ui';
import { useState } from 'react';

export default function useRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = (executeRefresh: () => Promise<any>) => {
    return async () => {
      setRefreshing(true);
      await executeRefresh();
      setRefreshing(false);
      showToast({
        title: '刷新成功！',
        icon: 'success',
      });
    };
  };

  return {
    refreshing,
    onRefresh,
  };
}
