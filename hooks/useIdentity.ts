// import LandlordBusiness from '@/business/LandlordBusiness';
// import TenantBusiness from '@/business/TenantBussiness';
// import AuthConstant from '@/constant/AuthConstant';
// import BusinessConstant from '@/constant/BusinessConstant';
// import ImageConstant from '@/constant/ImageConstant';
import authStore from '@/stores/auth';
import userStore from '@/stores/user';
import { useRouter } from 'expo-router';

export default function useIdentity() {
  const { setUser } = userStore;
  const { setPreIdentityState, clearIdentityState, identity } = authStore;
  const router = useRouter();
  // /**
  //  * 用户登录
  //  * @param phone 手机
  //  * @param password 密码
  //  */
  // const userLogin = async (phone: string, password: string) => {
  //   if (identity === AuthConstant.LANDLORD) {
  //     await LandlordBusiness.landlordLogin(phone, password);
  //   } else if (identity === AuthConstant.TENANT) {
  //     await TenantBusiness.tenantLogin(phone, password);
  //   }
  // };

  // /**
  //  * 用户注册
  //  * @param phone 手机
  //  * @param password 密码
  //  * @param checkPassword 确认密码
  //  */
  // const userRegistry = async (
  //   phone: string,
  //   password: string,
  //   checkPassword: string
  // ) => {
  //   if (password !== checkPassword) {
  //     showToast({
  //       title: '两次输入的密码不一致',
  //       icon: 'none',
  //     });
  //     throw '';
  //   }
  //   if (identity === AuthConstant.LANDLORD) {
  //     await LandlordBusiness.landlordRegistry(phone, password);
  //   } else if (identity === AuthConstant.TENANT) {
  //     await TenantBusiness.tenantRegistry(phone, password);
  //   }
  // };

  // /**
  //  * 获取用户信息
  //  */
  // const getUserInfo = async () => {
  //   if (identity === AuthConstant.LANDLORD) {
  //     // 房东端
  //     const user: any = await LandlordBusiness.getLandlord();
  //     user && setUser(user);
  //   } else if (identity === AuthConstant.TENANT) {
  //     // 租客端
  //     const user: any = await TenantBusiness.getTenant();
  //     user && setUser(user);
  //   }
  // };

  // /**
  //  * 上传用户头像url
  //  */
  // const uploadUserHeadImgUrl = () => {
  //   if (identity === AuthConstant.LANDLORD) {
  //     return ImageConstant.UPLOAD_LANDLORD_HEAD_IMG;
  //   } else if (identity === AuthConstant.TENANT) {
  //     return ImageConstant.UPLOAD_TENANT_HEAD_IMG;
  //   }
  // };

  // /**
  //  * 更新用户
  //  */
  // const updateUser = async (data: { name?: string; remark?: string }) => {
  //   if (identity === AuthConstant.LANDLORD) {
  //     // 房东端
  //     return await LandlordBusiness.updateUserLandlord(data);
  //   } else if (identity === AuthConstant.TENANT) {
  //     // 租客端
  //     return await TenantBusiness.updateTenant(data);
  //   }
  // };

  // /**
  //  * 获取用户信息通过id列表
  //  */
  // const getUserByIdList = async (
  //   userIdList: { id: number; otherId: string; identity: string }[]
  // ) => {
  //   const landlordId: number[] = [];
  //   const tenantId: number[] = [];
  //   // 分类出哪些是房东id和租客id
  //   userIdList.forEach((item) => {
  //     if (item.identity === AuthConstant.TENANT) {
  //       tenantId.push(item.id);
  //     } else if (item.identity === AuthConstant.LANDLORD) {
  //       landlordId.push(item.id);
  //     }
  //   });
  //   // 发送请求获取用户信息
  //   const tenantPromise = new Promise(async (resolve) => {
  //     if (tenantId.length) {
  //       const res: any = await TenantBusiness.getTenantByIdList(
  //         tenantId.join(',')
  //       );
  //       resolve(res);
  //     } else {
  //       resolve([]);
  //     }
  //   });
  //   const landlordPromise = new Promise(async (resolve) => {
  //     if (landlordId.length) {
  //       const res: any = await LandlordBusiness.getLandlordByIds(
  //         landlordId.join(',')
  //       );
  //       resolve(res);
  //     } else {
  //       resolve([]);
  //     }
  //   });
  //   return new Promise(async (resolve) => {
  //     const [tenantList, landlordList] = await Promise.all([
  //       tenantPromise,
  //       landlordPromise,
  //     ]);
  //     const userInfoList: any = [];
  //     if (tenantList instanceof Array && tenantList.length) {
  //       tenantList.forEach((tenant: TenantEntity.ITenant) => {
  //         userInfoList.push({
  //           ...tenant,
  //           otherId: `${BusinessConstant.SIGN_TENANT},${tenant.id}`,
  //         });
  //       });
  //     }
  //     if (landlordList instanceof Array && landlordList.length) {
  //       landlordList.forEach((landlord: LandlordEntity.ILandlord) => {
  //         userInfoList.push({
  //           ...landlord,
  //           otherId: `${BusinessConstant.SIGN_LANDLORD},${landlord.id}`,
  //         });
  //       });
  //     }
  //     resolve(userInfoList);
  //   });
  // };

  // /**
  //  * 用户实名
  //  */
  // const userIdentityVerification = async (
  //   verifyMsg:
  //     | TenantEntity.ITenantVerification
  //     | LandlordEntity.ILandlordVerification
  // ) => {
  //   if (identity === AuthConstant.LANDLORD) {
  //     return await LandlordBusiness.landlordIdentityVerification(verifyMsg);
  //   } else if (identity === AuthConstant.TENANT) {
  //     return await TenantBusiness.tenantIdentityVerification(verifyMsg);
  //   }
  // };

  /**
   * 切换身份
   */
  const switchIdentity = async (e: any) => {
    e.stopPropagation();
    // 切换身份之前保存当前身份作为上一次身份
    setPreIdentityState(identity!);
    await clearIdentityState();
    router.replace('/identity');
  };

  return {
    // getUserInfo,
    // uploadUserHeadImgUrl: uploadUserHeadImgUrl(),
    // updateUser,
    // userLogin,
    // userRegistry,
    // userIdentityVerification,
    // getUserByIdList,
    switchIdentity,
  };
}
