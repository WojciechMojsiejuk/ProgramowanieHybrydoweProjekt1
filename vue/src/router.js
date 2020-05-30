import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search';
import Artists from "./views/Artists";
import Login from "./views/Login";
import Logout from "./views/Logout";
import BooksList from "@/views/BooksList";

Vue.use(Router);

export default new Router({
    routes:
    [
        {
            path: '/playlist/add',
            name: 'Search',
            component: Search,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/bookslist',
            name: 'Bookslist',
            component: BooksList,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/artists',
            name: 'artists',
            component: Artists,
            meta: {
                requiresAuth: true,
                isAdmin : true
            }
        },
        {
            path: '/',
            name: 'Login',
            component: Login,
        },
        {
            path: '/logout',
            name: 'Logout',
            component: Logout,
        },
    ]
});