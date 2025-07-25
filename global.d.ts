declare module '@/global' {
  type TIdentity = 'landlord' | 'tenant';

  /**
   * user send chat message interface
   */
  interface ISendChatMessage {
    /**
     * chat message session id
     */
    sessionId: number;
    /**
     * sender id
     */
    senderId: string;
    /**
     * receiver id
     */
    receiverId: string;
    /**
     * chat message content
     */
    content: string;
    /**
     * message type 1(text) 2(image) 3(video)
     */
    type: number;
  }

  /**
   * a chat message interface
   */
  interface IChatMessage extends ISendChatMessage {
    /**
     * chat message id
     */
    id: number;
    /**
     * create time
     */
    createdAt: Date;
    /**
     * update time
     */
    updatedAt: Date;
  }

  /**
   * add a chat list (session)
   */
  interface IAddChatSession {
    /**
     * sender id
     */
    senderId: string;
    /**
     * receiver id
     */
    receiverId: string;
  }

  /**
   * a session interface
   */
  interface IChatSession extends IAddChatSession {
    /**
     * chat_list id
     */
    id: number;
    /**
     * mark whether the receiver is online 0(offline) 1(online)
     */
    isOnline: number;
    /**
     * number of unread messages of the receiver
     */
    unread: number;
    /**
     * status of this chat session 0(deleted) 1(normal)
     */
    status: number;
    /**
     * create time
     */
    createdAt: Date;
    /**
     * update time
     */
    updatedAt: Date;
  }

  /**
   * tenant collect house interface
   */
  interface IHouseCollect extends Omit<IHouseLease, 'leaseId' | 'status'> {
    /**
     * id
     */
    collectId: number;
    /**
     * collected status 0(not collected) 1(collected)
     */
    status: number;
  }

  /**
   * tenant collect list
   */
  interface ICollectList {
    /**
     * house id
     */
    houseId: number;
    /**
     * collect number
     */
    count: number;
  }

  /**
   * when tenant add comment interface
   */
  interface IAddComment {
    /**
     * house id
     */
    houseId: number;
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * tenant id
     */
    tenantId: number;
    /**
     * lease id
     */
    leaseId: number;
    /**
     * house score
     */
    houseScore: number;
    /**
     * score for landlord
     */
    landlordScore: number;
    /**
     * comment content
     */
    comment: string;
    /**
     * comment image url
     */
    image: string;
  }

  /**
   * a comment interface
   */
  interface IComment extends IAddComment {
    /**
     * comment id
     */
    id: number;
    /**
     * create time
     */
    createdAt: Date;
    /**
     * update time
     */
    updatedAt: Date;
  }

  /**
   * when landlord or tenant start complaint interface
   */
  interface IAddComplaint {
    /**
     * complainant id
     */
    complaintId: number;
    /**
     * identity (mark complainant is landlord or tenant)
     */
    identity: number;
    /**
     * connect phone number
     */
    phone: string;
    /**
     * reason of complaint
     */
    reason: string;
    /**
     * complaint image
     */
    image: string;
    /**
     * complaint video
     */
    video: string;
  }

  /**
   * a complaint interface
   */
  interface IComplaint extends IAddComplaint {
    /**
     * complaint id
     */
    id: number;
    /**
     * complaint status
     */
    status: number;
    /**
     * create time
     */
    createdAt: Date;
    /**
     * update time
     */
    updatedAt: Date;
  }

  /**
   * a house base info
   */
  interface IBaseHouse {
    /**
     * house name
     */
    name: string;
    /**
     * house price
     */
    price: number;
    /**
     * house image
     */
    houseImg: string;
    /**
     * house water price
     */
    waterFee: number;
    /**
     * house electricity price
     */
    electricityFee: number;
    /**
     * house internet price
     */
    internetFee: number;
    /**
     * house fuel price
     */
    fuelFee: number;
    /**
     * house deposit number of months to landlord
     */
    depositNumber: number;
    /**
     * house price number of months to landlord
     */
    priceNumber: number;
    /**
     * house area
     */
    area: number;
    /**
     * house floor
     */
    floor: number;
    /**
     * house toward 1(east) 2(west) 3(north) 4(south)
     */
    toward: number;
    /**
     * house toilet 0(not) 1(private) 2(public)
     */
    toilet: number;
    /**
     * house kitchen 0(not) 1(private) 2(public)
     */
    kitchen: number;
    /**
     * house have balcony 1(yes) 0(no)
     */
    balcony: number;
    /**
     * house address name
     */
    addressName: string;
    /**
     * house address detail
     */
    addressDetail: string;
    /**
     * house note
     */
    note?: string;
    /**
     * house status -1(not lease not public) 0(delete) 1(leased) 2(not lease but public)
     */
    status?: number;
  }

  /**
   * request params interface when add house
   */
  interface IAddHouseReq extends IBaseHouse {
    /**
     * house longitude
     */
    longitude: number;
    /**
     * house latitude
     */
    latitude: number;
  }

  /**
   * request params interface when update house info
   */
  interface IUpdateHouseReq
    extends Omit<
      IAddHouseReq,
      | 'provinceName'
      | 'cityName'
      | 'areaName'
      | 'addressInfo'
      | 'createdAt'
      | 'updatedAt'
      | 'landlordId'
    > {
    /**
     * house id
     */
    houseId: number;
    /**
     * house address id
     */
    addressId: number;
  }

  /**
   * house all message
   */
  interface IHouse extends Omit<IBaseHouse, 'addressDetail'> {
    /**
     * house address id
     */
    addressId: number;
    /**
     * the province where the house is located
     */
    provinceName: string;
    /**
     * the city where the house is located
     */
    cityName: string;
    /**
     * the area where the house is area
     */
    areaName: string;
    /**
     * house address name
     */
    addressName: string;
    /**
     * house address detail info
     */
    addressInfo: string;
    /**
     * house latitude
     */
    latitude: number;
    /**
     * house longitude
     */
    longitude: number;
    /**
     * house id
     */
    houseId: number;
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * house create time
     */
    createdAt: Date;
    /**
     * house update time
     */
    updatedAt: Date;
  }

  /**
   * search house by keyword interface
   */
  interface IGetHouseByKeyword {
    /**
     * search house min latitude
     */
    minLat: number;
    /**
     * search house max latitude
     */
    maxLat: number;
    /**
     * search house min longitude
     */
    minLng: number;
    /**
     * search house max longitude
     */
    maxLng: number;
    /**
     * search house keyword
     */
    keyword: string;
  }

  /**
   * lease house lease interface
   */
  interface IHouseLease extends Omit<IHouse, 'name' | 'status'> {
    /**
     * house name
     */
    houseName: string;
    /**
     * landlord name
     */
    landlordName: string;
    /**
     * landlord image
     */
    landlordImg: string;
    /**
     * lease house status -1(pendding) 0 (rejected) 1(passed)
     */
    status: number;
    /**
     * lease id
     */
    leaseId: number;
    /**
     * landlord phone number
     */
    landlordPhone: string;
    /**
     * tenant id
     */
    tenantId: number;
  }

  /**
   * tenant initiated house lease to landlord interface
   */
  interface IPendingLease {
    /**
     * house id
     */
    houseId: number;
    /**
     * house name
     */
    houseName: string;
    /**
     * house address
     */
    houseAddress: string;
    /**
     * tenant id
     */
    tenantId: number;
    /**
     * tenant head image
     */
    tenantHeadImg: string;
    /**
     * tenant name
     */
    tenantName: string;
    /**
     * tenant phone number
     */
    tenantPhone: string;
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * time when the tenant initiated the lease
     */
    leaseDate: Date | string;
    /**
     * tenant lease months
     */
    leaseMonths: number;
  }

  /**
   * leases that currently exist
   */
  type IExistLease = IPendingLease;

  /**
   * landlord add rent bill interface
   */
  interface IAddRentBillReq {
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * tenant id
     */
    tenantId: number;
    /**
     * house id
     */
    houseId: number;
    /**
     * last month electricity meter recorded value
     */
    lastElectricityMeter: number;
    /**
     * current month electricity meter recorded value
     */
    electricityMeter: number;
    /**
     * last month water meter recorded value
     */
    lastWaterMeter: number;
    /**
     * current month water meter recorded value
     */
    waterMeter: number;
    /**
     * last month fuel meter recorded value
     */
    lastFuelMeter: number;
    /**
     * current month fuel meter recorded value
     */
    fuelMeter: number;
    /**
     * bill date (YYYY-MM)
     */
    billDate: string;
    /**
     * current month house price
     */
    totalPrice: number;
  }

  /**
   * rent bill interface
   */
  interface IRentBill extends IAddRentBillReq {
    /**
     * bill id
     */
    id: number;
    /**
     * bill create time
     */
    createdAt: string | Date;
    /**
     * bill update time
     */
    updatedAt: string | Date;
  }

  /**
   * request param interface when querying a bill by bill date
   */
  interface IRentBillDateReq {
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * tenant id
     */
    tenantId: number;
    /**
     * house id
     */
    houseId: number;
    /**
     * bill date
     */
    billDate: string;
  }

  /**
   * repair house base interface
   */
  interface IBaseRepair {
    /**
     * house id
     */
    houseId: number;
    /**
     * landlord id
     */
    landlordId: number;
    /**
     * tenant id
     */
    tenantId: number;
    /**
     * house repair reason
     */
    reason: string;
    /**
     * house repair image url
     */
    image: string;
    /**
     * house repair video url
     */
    video: string;
  }

  /**
   * a house repair interface
   */
  interface IRepair extends IBaseRepair {
    /**
     * id
     */
    id: number;
    /**
     * repair status 0(pendding) 1(processed)
     */
    status: number;
    /**
     * create time
     */
    createdAt: Date;
    /**
     * Time to complete maintenance
     */
    updatedAt: Date;
  }

  /**
   * request param interface when add repair
   */
  type IAddRepairReq = IBaseRepair;

  /**
   * landlord and tenant interface
   */
  interface IUser extends IUserVerify {
    /**
     * user id
     */
    id: number;
    /**
     * user name
     */
    name: string;
    /**
     * user remark
     */
    remark?: string;
    /**
     * user phone
     */
    phone: string;
    /**
     * user source 1(wechat) 2(app)
     */
    sourceType?: number;
    /**
     * status 1(normal) 2(disable) 3(deleted)
     */
    status?: number;
    /**
     * user head image
     */
    headImg?: string;
    /**
     * register date
     */
    createdAt?: string;
    /**
     * update date
     */
    updatedAt?: string;
  }

  /**
   * chat session user interface
   */
  interface IChatSessionUser extends IUser {
    /**
     * chat session receiver id
     */
    otherId: string;
  }

  /**
   * user identity verify
   */
  interface IUserVerify {
    identityName: string;
    identitySex: number;
    identityNation: string;
    identityBorn: string;
    identityAddress: string;
    identityNumber: string;
    identityImg: string;
  }

  /**
   * server return base response format
   */
  interface BaseRes<T = any> {
    code: number;
    message: string;
    data: T;
  }

  /**
   * login request params type
   */
  type ILogin = {
    phone: string;
    password: string;
  };
  type IRegister = ILogin;

  /**
   * update base user info interface
   */
  interface IUpdateBaseUserInfo {
    name?: string;
    remark?: string;
  }

  /**
   * tencent map location
   */
  interface ITencentMapLocation {
    cityname: string;
    latlng: {
      lat: number;
      lng: number;
    };
    poiaddress: string;
    poiname: string;
  }
}
