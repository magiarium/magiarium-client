import { DateTimeString } from '@magiarium/structure';
import dayjs from 'dayjs';

/**
 * 現在時刻(所定フォーマットのString型)取得処理
 *
 * @returns 現在時刻文字列
 */
export const getNowDateTimeString = (): DateTimeString => {
  return dayjs().format('YYYYMMDDHHmmss') as DateTimeString;
};
