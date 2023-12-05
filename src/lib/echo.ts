import LaravelEcho from 'laravel-echo';
import {api} from "./api";

// import PusherJS from 'pusher-js';
//@ts-ignore
Window.Pusher = require('pusher-js');
function getMixPusherHost(){
    if(process.env.CLIENT_PUSHER_HOST){
        return process.env.CLIENT_PUSHER_HOST;
    }
    return location.hostname;
}
function getMixPusherPort(){
    if(process.env.CLIENT_PUSHER_PORT){
        return process.env.CLIENT_PUSHER_PORT;
    }
    return location.port;
}
const targetHost = getMixPusherHost();
const targetPort = getMixPusherPort();

export const Echo = new LaravelEcho({
    broadcaster: 'pusher',
    key: process.env.PUSHER_APP_KEY,
    wsHost: targetHost,
    forceTLS: false,
    wsPort: targetPort,
    wssPort: targetPort,
    cluster: process.env.PUSHER_APP_CLUSTER || 'mt1',
    wsPath : parseInt(location.port) === parseInt(targetPort) ?  '/ws' : (process.env.PUSH_PATH || undefined),
    encrypted: true,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    auth: {
        withCredentials: true,
        headers: {
        }
    },
    authorizer: (channel : {name : string}, options : any) => {
        return {
            authorize: (socketId : string, callback : Function) => {
                api({
                    authRedirect : false,
                    url : '/api/broadcasting/auth',
                    method : 'post',
                    data : {
                        socket_id: socketId,
                        channel_name: channel.name,
                    }
                })
                .then(response => {
                    callback(false, response);
                })
                .catch(error => {
                    // console.log(error);
                    callback(true, error);
                });
            }
        };
    },
});
