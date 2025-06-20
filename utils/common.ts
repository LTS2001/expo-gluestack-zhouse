/**
 * 格式化世界标准时间
 * @param utcTime 世界标准时间
 */
export function formatUtcTime(utcTime?: Date | string | null) {
  if (!utcTime) return '';
  const d = new Date(utcTime);
  const year = d.getFullYear();
  let month: number | string = d.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  let day: number | string = d.getUTCDate();
  day = day < 10 ? "0" + day : day;
  let hours: number | string = d.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  let minutes: number | string = d.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let seconds: number | string = d.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 计算某个时间点到现在的天数
 */
export function getDayNum(date1: string) {
  // 将时间点转换为毫秒数
  const oneDay = 1000 * 60 * 60 * 24; // 一天的毫秒数
  const time1 = new Date(date1).getTime();
  const time2 = new Date().getTime();
  // 计算时间点之间的毫秒数差异
  const timeDiff = Math.abs(time2 - time1);
  // 将毫秒数转换为天数并返回
  return Math.floor(timeDiff / oneDay);
}

/**
 * 是否是某分钟前
 * @param date1 需要判断的时间
 * @param date2 需要判断的时间
 * @param interval 时间间隔
 */
export function isCertainMinuteAge(date1: Date, date2: Date, interval: number) {
  const compareDate1 = new Date(date1).getTime();
  const compareDate2 = new Date(date2).getTime();
  return Math.abs(compareDate1 - compareDate2) > interval;
}

/**
 * 格式化聊天时间
 * @param formatDate 时间（格式化的时间）
 * @param isSession 是否是会话
 */
export function formatChatDate(formatDate: Date, isSession?: boolean) {
  if (!formatDate) return;
  // 今天的日期
  const today = new Date();
  // 昨天的日期
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  // 需要作比较的日期
  const date = new Date(formatDate);
  const year = date.getFullYear();
  const month: number | string = date.getMonth() + 1;
  const day: number | string = date.getUTCDate();
  let hours: number | string = date.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  let minutes: number | string = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  if (
    year === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    // 今天
    return `${hours}:${minutes}`;
  } else if (
    year === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    // 昨天
    return isSession ? "昨天" : `昨天 ${hours}:${minutes}`;
  } else if (year === today.getFullYear()) {
    // 今年
    return isSession
      ? `${month}月${day}日`
      : `${month}月${day}日 ${hours}:${minutes}`;
  } else {
    return isSession
      ? `${year}年${month}月${day}日`
      : `${year}年${month}月${day}日 ${hours}:${minutes}`;
  }
}

/**
 * 计算经度距离
 * @param latitude 纬度
 */
export function calculateLongitudeDistance(latitude: number) {
  const earthRadius = 6371; // 地球半径（单位：公里）
  return (
    Math.cos((latitude * Math.PI) / 180) * earthRadius * ((2 * Math.PI) / 360)
  );
}

/**
 * 计算给定坐标方圆几公里内的坐标范围
 * @param latitude 纬度
 * @param longitude 经度
 * @param radius 范围
 */
export function calculateCoordinatesWithinRadius(
  latitude: number,
  longitude: number,
  radius: number
) {
  // 计算1度经度在该纬度下的距离
  const longitudeDistance = calculateLongitudeDistance(latitude);
  // 经度和纬度方向上的5公里增量
  const deltaLongitude = radius / longitudeDistance;
  const deltaLatitude = radius / 111; // 1度纬度约等于111公里

  // 计算5公里范围内的经纬度
  const minLng = Number((longitude - deltaLongitude).toFixed(6));
  const maxLng = Number((longitude + deltaLongitude).toFixed(6));
  const minLat = Number((latitude - deltaLatitude).toFixed(6));
  const maxLat = Number((latitude + deltaLatitude).toFixed(6));

  return { minLng, maxLng, minLat, maxLat };
}

/**
 * 根据指定时间加上指定月数得出时间
 * @param baseDate 基础时间
 * @param monthsToAdd 需要加的月数
 * @returns
 */
export function addMonthsToDate(
  baseDate: Date,
  monthsToAdd: number
): string | undefined {
  const date = new Date(baseDate);
  // 获取初始的年和月
  const year = date.getFullYear();
  const month = date.getMonth(); // 注意：0 表示 1 月，11 表示 12 月

  // 计算新的年月
  const newYear = year + Math.floor((month + monthsToAdd) / 12);
  const newMonth = (month + monthsToAdd) % 12;

  // 如果月份是负数（例如 -1 表示去年 12 月），调整月份值
  const adjustedMonth = newMonth < 0 ? newMonth + 12 : newMonth;

  // 创建新的日期对象
  const result = new Date(date);
  result.setFullYear(newYear, adjustedMonth);

  // 自动调整溢出日期（如 2 月 30 日变成 2 月 28 日）
  return formatUtcTime(result);
}

/**
 * 获取给定日期的上一个月份
 * @param yearMonth 年月比如：2024-12
 */
export function getPreviousMonth(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  const date = new Date(year, month - 1, 1); // 当前月份的第一天
  date.setMonth(date.getMonth() - 1);       // 设置为上一个月
  const previousYear = date.getFullYear();
  const previousMonth = String(date.getMonth() + 1).padStart(2, '0'); // 保证两位
  return `${previousYear}-${previousMonth}`;
}

