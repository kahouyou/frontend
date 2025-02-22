import { toZonedTime, fromZonedTime } from "date-fns-tz";
import type { HassConfig } from "home-assistant-js-websocket";
import type { FrontendLocaleData } from "../../data/translation";
import { TimeZone } from "../../data/translation";

const calcZonedDate = (
  date: Date,
  tz: string,
  fn: (date: Date, options?: any) => Date | number | boolean,
  options?
) => {
  const inputZoned = toZonedTime(date, tz);
  const fnZoned = fn(inputZoned, options);
  if (fnZoned instanceof Date) {
    return fromZonedTime(fnZoned, tz) as Date;
  }
  return fnZoned;
};

export const calcDate = (
  date: Date,
  fn: (date: Date, options?: any) => Date,
  locale: FrontendLocaleData,
  config: HassConfig,
  options?
) =>
  locale.time_zone === TimeZone.server
    ? (calcZonedDate(date, config.time_zone, fn, options) as Date)
    : fn(date, options);

export const calcDateProperty = (
  date: Date,
  fn: (date: Date, options?: any) => boolean | number,
  locale: FrontendLocaleData,
  config: HassConfig,
  options?
) =>
  locale.time_zone === TimeZone.server
    ? (calcZonedDate(date, config.time_zone, fn, options) as number | boolean)
    : fn(date, options);

export const calcDateDifferenceProperty = (
  endDate: Date,
  startDate: Date,
  fn: (date: Date, options?: any) => boolean | number,
  locale: FrontendLocaleData,
  config: HassConfig
) =>
  calcDateProperty(
    endDate,
    fn,
    locale,
    config,
    locale.time_zone === TimeZone.server
      ? toZonedTime(startDate, config.time_zone)
      : startDate
  );
