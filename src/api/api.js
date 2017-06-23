import axios from 'axios';

let base = 'http://localhost:8080/walmartapp';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getItemListPage = params => { return axios.post(`${base}/item/search`, params).then(res => res.data); };

export const retireItem = params => { return axios.post(`${base}/item/retireItem`, params).then(res => res.data); };

export const updateItems = params => { return axios.post(`${base}/item/updateItem`, params).then(res => res.data); };

export const updateItemPrice = params => { return axios.post(`${base}/item/updatePrice`, params).then(res => res.data); };

export const updateItemInventory = params => { return axios.post(`${base}/item/updateInventory`, params).then(res => res.data); };

export const getFeedListPage = params => { return axios.post(`${base}/feed/search`, params).then(res => res.data); };

export const updateFeeds = params => { return axios.post(`${base}/feed/updateFeed`, params).then(res => res.data); };

export const getFeedDetail = params => { return axios.post(`${base}/feed/getFeedDetail`, params).then(res => res.data); };

export const addPromotion = params => { return axios.post(`${base}/item/addPromotion`, params).then(res => res.data); };

export const getPromotion = params => { return axios.post(`${base}/item/getPromotion`, params).then(res => res.data); };

export const cancelPromotion = params => { return axios.post(`${base}/item/deletePromotion`, params).then(res => res.data); };

export const getPriceListUrl = params => { return `${base}/item/download?downloadId=`; };

export const getInventoryListUrl = params => { return `${base}/item/download?downloadId=`; };

export const downLoadPriceList = params => { return axios.post(`${base}/item/exportPrice`, params).then(res => res.data); };

export const downLoadInventoryList = params => { return axios.post(`${base}/item/exportInventory`, params).then(res => res.data); };

export const updateBulkPrice = params => { return `${base}/item/updateBulkPrice?token=`; };

export const updateBulkInventory = params => { return `${base}/item/updateBulkInventory?token=`; };

export const updateBulkAddPromotion = params => { return `${base}/item/bulkAddPromotion?token=`; };


export const getOrderListPage = params => { return axios.post(`${base}/order/search`, params).then(res => res.data); };

export const updateOrder = params => { return axios.post(`${base}/order/updateOrder`, params).then(res => res.data); };

export const uplodTracking = params => { return axios.post(`${base}/order/uplodTracking`, params).then(res => res.data); };

export const refundOrder = params => { return axios.post(`${base}/order/refundOrder`, params).then(res => res.data); };

export const cancelOrder = params => { return axios.post(`${base}/order/cancelOrder`, params).then(res => res.data); };

export const getOrderDetail = params => { return axios.post(`${base}/order/getItemDetail`, params).then(res => res.data); };

export const uploadItem = params => { return `${base}/feed/uploadItem?token=`; };