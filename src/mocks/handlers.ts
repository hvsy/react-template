import dayjs from "dayjs";
import { rest } from "msw";


// remember you have to match the params that you're passing here
const base = `${process.env.API}`;
console.log('mock base:',base);
const getUserData = rest.get(`${base}/ping`, (req,res, ctx) =>
        res(ctx.json(dayjs().format('YYYY-MM-DD hh:mm:ss')))
);

//it returns array of request handlers
export const handlers = [getUserData];
