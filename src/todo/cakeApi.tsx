import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { CakeProps } from './CakeProps';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins; //local
const itemUrl = `http://${baseUrl}/api/cake`;

export const getItems: (token: string) => Promise<CakeProps[]> = (token) => {
    //return withLogs(axios.get(itemUrl, authConfig(token)), 'getItems');
    var result = axios.get(itemUrl, authConfig(token));
    result.then(function (result) {
        result.data.forEach(async (item: CakeProps) => {
            await Storage.set({
                key: item._id!,
                value: JSON.stringify(
                    {
                        id: item._id,
                        name: item.name,
                        countertops: item.countertops,
                        cream: item.cream,
                        amount: item.amount,
                        design: item.design,
                        photoPath: item.photoPath,
                        latitude: item.latitude,
                        longitude: item.longitude
                    }
                ),
            });
        });
    });
        return withLogs(result, "getItems");
};

export const getItem: (token: string, id:string) => Promise<CakeProps> = (token,id) =>{
    var result= axios.get(`${itemUrl}/${id}`,authConfig(token))
    return withLogs(result, "getItem");
}


export const createItem:
    (token: string,
     item: CakeProps)
        => Promise<CakeProps> = (token, item) => {
    var result = axios.post(itemUrl, item, authConfig(token));
    result.then(async function (r) {
        var item = r.data;
        await Storage.set({
            key: item._id!,
            value: JSON.stringify({id: item._id,
                name: item.name,
                countertops: item.countertops,
                cream: item.cream,
                amount: item.amount,
                design: item.design,
                photoPath: item.photoPath,
                latitude: item.latitude,
                longitude: item.longitude}),
        });
    });
    return withLogs(result, "createItem");
};

export const updateItem: (
    token: string,
    item: CakeProps
) => Promise<CakeProps> = (token, item) => {
    var result = axios.put(`${itemUrl}/${item._id}`, item, authConfig(token));
    result
        .then(async function (r) {
            var item = r.data;
            await Storage.set({
                key: item._id!,
                value: JSON.stringify({
                    id: item._id,
                    name: item.name,
                    countertops: item.countertops,
                    cream: item.cream,
                    amount: item.amount,
                    design: item.design,
                    photoPath: item.photoPath,
                    latitude: item.latitude,
                    longitude: item.longitude
                }),
            });
        });
    return withLogs(result, "updateItem");
};
export const eraseItem: (
    token: string,
    item: CakeProps)
    => Promise<CakeProps[]> = (token, item) => {
    var result = axios.delete(`${itemUrl}/${item._id}`, authConfig(token));
    result.then(async function (r) {
        await Storage.remove({ key: item._id! });
    });
    return withLogs(result, "deleteItem");
};

interface MessageData {
    type: string;
    payload: CakeProps;
}

const log = getLogger('ws');

export const newWebSocket = (
    token: string,
        onMessage: (data: MessageData) => void
    ) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log("web socket onopen");
        ws.send(JSON.stringify({ type: "authorization", payload: { token } }));
    };
    ws.onclose = () => {
        log("web socket onclose");
    };
    ws.onerror = (error) => {
        log("web socket onerror", error);
    };
    ws.onmessage = (messageEvent) => {
        log("web socket onmessage");
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    };
};

