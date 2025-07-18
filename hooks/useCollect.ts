import { getCollectStatus } from '@/request/api/house-collect';
import authStore from '@/stores/auth';
import userStore from '@/stores/user';

export default function useCollect() {
  /**
   * 更改收藏状态（收藏/取消收藏）
   * @param houseId 房屋id
   * @param landlordId 房东id
   * @param status （0：未收藏，1：已收藏）
   */
  const changeCollectStatus = async (
    houseId: number,
    landlordId: number,
    status: number
  ) => {
    // // 判断是否登录，未登录则跳到登录页面
    // if (!authStore.isLogin) {
    //   navigateTo({
    //     url: `/pages/login/index?execute=${ BusinessConstant.EXECUTE_BACK }`
    //   });
    //   return;
    // }
    // return await HouseCollectBusiness.changeCollectStatus({
    //   houseId,
    //   landlordId,
    //   tenantId: userStore.user?.id,
    //   status
    // });
  };

  /**
   * get house collect status
   * @param houseId house id
   */
  const getHouseCollectStatus = async (houseId: number) => {
    if (!authStore.isLogin) return;
    if (houseId && userStore.user?.id) {
      const res: any = await getCollectStatus(houseId, userStore.user.id);
      if (res?.status) return res.status;
    }
  };

  return {
    changeCollectStatus,
    getHouseCollectStatus,
  };
}
