import Vue from 'vue';
import Router from 'vue-router';
import Search from './views/Search';
import Authors from "./views/Authors";
import Login from "./views/Login";
import Logout from "./views/Logout";
import BooksList from "@/views/BooksList";

Vue.use(Router);

export default new Router({
    routes:
    [
        {
            path: '/bookslist/add',
            name: 'Search',
            component: Search,
        },
        {
            path: '/bookslist',
            name: 'Bookslist',
            component: BooksList,
        },
        {
            path: '/authors',
            name: 'authors',
            component: Authors,
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