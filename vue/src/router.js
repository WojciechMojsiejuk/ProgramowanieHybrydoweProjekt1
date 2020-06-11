import Vue from 'vue';
import Router from 'vue-router';
import AddBook from './views/AddBook';
import Authors from "./views/Authors";
import Login from "./views/Login";
import Logout from "./views/Logout";
import Resources from "./views/Resources";
import Users from "./views/Users";
import BooksList from "@/views/BooksList";
Vue.use(Router);

export default new Router({
    routes:
    [
        {
            path: '/books',
            name: 'Resources',
            component: Resources,
        },
        {
            path: '/books/add',
            name: 'AddBook',
            component: AddBook,
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
        {
            path: '/users',
            name: 'Users',
            component: Users,
        },
    ]
});