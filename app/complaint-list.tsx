import { getComplaintList } from '@/business';
import { ComplaintCard, Empty } from '@/components';
import { Icon, TouchableOpacity, View } from '@/components/ui';
import { IComplaint } from '@/global';
import { complaintStore } from '@/stores';
import { router } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ScrollView } from 'react-native';

const ComplaintList = () => {
  const { complaintList } = complaintStore;
  useEffect(() => {
    getComplaintList();
  }, []);

  const toWriteComplaint = () => {
    router.push({
      pathname: '/user-report-for-complaint',
    });
  };

  return (
    <View className='flex-1 relative'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='flex-grow'
      >
        {complaintList?.length ? (
          <View className='gap-6 pb-8 pt-4'>
            {complaintList?.map((complaint: IComplaint) => (
              <ComplaintCard
                key={complaint.id}
                status={complaint.status}
                reason={complaint.reason}
                createdAt={complaint.createdAt}
                updatedAt={complaint.updatedAt}
                images={JSON.parse(complaint.image)}
                video={JSON.parse(complaint.video)}
              />
            ))}
          </View>
        ) : (
          <Empty text='暂无投诉记录' />
        )}
      </ScrollView>
      <TouchableOpacity
        className='absolute bottom-24 right-8 bg-primary-500 rounded-full p-3'
        onPress={toWriteComplaint}
      >
        <Icon as='AntDesign' name='plus' lightColor='white' darkColor='black' />
      </TouchableOpacity>
    </View>
  );
};

export default observer(ComplaintList);
