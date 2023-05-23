import dayjs from "dayjs";

export const DateRanges = {
    '今天' : [dayjs().startOf('day'),dayjs().endOf('day')] as [any, any],
    '本周' : [dayjs().startOf('week'),dayjs().endOf('week')] as [any, any],
    '本月' : [dayjs().startOf('month'),dayjs().endOf('month')] as [any, any],
    '上月' : [dayjs().startOf('month').subtract(1,"month"),dayjs().subtract(1,'month').endOf('month')] as [any, any],
    '最近七天' : [dayjs().subtract(7,"day"),dayjs()] as [any, any],
    '最近三个月' : [dayjs().startOf('month').subtract(3,"month"),dayjs().endOf('month')] as [any, any],
    //'quarter' : [dayjs().startOf()]
};

export const DateRangePresets = Object.keys(DateRanges).map((key) => {
    return {
        label : key,
        value : DateRanges[key as  keyof typeof DateRanges]
    }
});
