import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import ItemList from './views/Item/ItemList.vue'
import FeedList from './views/Item/FeedList.vue'
import OrderList from './views/Order/OrderList.vue'
let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: 'Product Management',
        iconCls: 'fa fa-th-large',//图标样式class
        children: [
            {path: '/table', component: ItemList, name: 'Product List'},
            {path: '/feeds', component: FeedList, name: 'Upload Product'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Order Management',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/order', component: OrderList, name: 'Order List'},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;