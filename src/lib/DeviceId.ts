import {nanoid} from "nanoid";
import {AppStorage} from "@/lib/AppStorage";

export const DeviceId = new AppStorage('DEVICE_ID');

export function getDeviceId(){
    if(!DeviceId.get()){
        DeviceId.set(nanoid());
    }
    return DeviceId.get();
}
