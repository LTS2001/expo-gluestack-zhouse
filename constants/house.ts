/**
 * field -> name
 */
export const FieldToNameMap = {
  price: '租金',
  waterFee: '水费',
  electricityFee: '电费',
  internetFee: '网费',
  fuelFee: '燃气费',
  depositNumber: '押金月数',
  priceNumber: '支付月数',
  area: '面积',
  floor: '楼层',
  toward: '朝向',
  toilet: '卫生间',
  kitchen: '厨房',
  balcony: '阳台',
  addressName: '地址名称',
  addressInfo: '详细地址',
  note: '备注',
};

/**
 * field -> unit
 */
export const FieldToUnit = {
  price: '元',
  waterFee: '元/吨',
  electricityFee: '元/度',
  internetFee: '元/月',
  fuelFee: '元/m³',
  depositNumber: '月',
  priceNumber: '月',
  area: '平方',
  floor: '层',
};

/**
 * toward -> name
 */
export const TowardToNameMap = {
  1: '东',
  2: '西',
  3: '南',
  4: '北',
};

/**
 * toilet -> name
 */
export const ToiletToNameMap = {
  1: '没有',
  2: '独立',
  3: '公用',
};

/**
 * kitchen -> name
 */
export const KitchenToNameMap = {
  1: '没有',
  2: '独立',
  3: '公用',
};

/**
 * balcony -> name
 */
export const BalconyToNameMap = {
  1: '没有',
  2: '有',
};

/**
 * house status
 */
export const HouseToStatusMap = {
  /**
   * not lease not released
   */
  notLeaseNotReleased: -1,
  /**
   * deleted
   */
  delete: 0,
  /**
   * released
   */
  release: 1,
  /**
   * not lease released
   */
  notLeaseReleased: 2,
};

export const HouseToLeaseMap = {
  /**
   * pending processing
   */
  pendingProcessing: -1,
  /**
   * rejected
   */
  rejected: 0,
  /**
   * leased
   */
  leased: 1,
  /**
   * rented
   */
  rented: 2,
};
