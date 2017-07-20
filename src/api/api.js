import axios from 'axios';

var conf = require('./conf');

export const requestLogin = params => { return axios.post(`${conf.base}/login`, params).then(res => res.data); };

export const getItemListPage = params => { return axios.post(`${conf.base}/item/search`, params).then(res => res.data); };

export const retireItem = params => { return axios.post(`${conf.base}/item/retireItem`, params).then(res => res.data); };

export const updateItems = params => { return axios.post(`${conf.base}/item/updateItem`, params).then(res => res.data); };

export const updateItemPrice = params => { return axios.post(`${conf.base}/item/updatePrice`, params).then(res => res.data); };

export const updateItemInventory = params => { return axios.post(`${conf.base}/item/updateInventory`, params).then(res => res.data); };

export const getFeedListPage = params => { return axios.post(`${conf.base}/feed/search`, params).then(res => res.data); };

export const updateFeeds = params => { return axios.post(`${conf.base}/feed/updateFeed`, params).then(res => res.data); };

export const getFeedDetail = params => { return axios.post(`${conf.base}/feed/getFeedDetail`, params).then(res => res.data); };

export const addPromotion = params => { return axios.post(`${conf.base}/item/addPromotion`, params).then(res => res.data); };

export const getPromotion = params => { return axios.post(`${conf.base}/item/getPromotion`, params).then(res => res.data); };

export const cancelPromotion = params => { return axios.post(`${conf.base}/item/deletePromotion`, params).then(res => res.data); };

export const getPriceListUrl = params => { return `${conf.base}/item/download?downloadId=`; };

export const getInventoryListUrl = params => { return `${conf.base}/item/download?downloadId=`; };

export const downLoadPriceList = params => { return axios.post(`${conf.base}/item/exportPrice`, params).then(res => res.data); };

export const downLoadInventoryList = params => { return axios.post(`${conf.base}/item/exportInventory`, params).then(res => res.data); };

export const updateBulkPrice = params => { return `${conf.base}/item/updateBulkPrice?token=`; };

export const updateBulkInventory = params => { return `${conf.base}/item/updateBulkInventory?token=`; };

export const updateBulkAddPromotion = params => { return `${conf.base}/item/bulkAddPromotion?token=`; };


export const getOrderListPage = params => { return axios.post(`${conf.base}/order/search`, params).then(res => res.data); };

export const updateOrder = params => { return axios.post(`${conf.base}/order/updateOrder`, params).then(res => res.data); };

export const uplodTracking = params => { return axios.post(`${conf.base}/order/uplodTracking`, params).then(res => res.data); };

export const refundOrder = params => { return axios.post(`${conf.base}/order/refundOrder`, params).then(res => res.data); };

export const cancelOrder = params => { return axios.post(`${conf.base}/order/cancelOrder`, params).then(res => res.data); };

export const getOrderDetail = params => { return axios.post(`${conf.base}/order/getItemDetail`, params).then(res => res.data); };

export const uploadItem = params => { return `${conf.base}/feed/uploadItem?token=`; };

export const requestRegister = params => { return axios.post(`${conf.base}/register`, params).then(res => res.data); };