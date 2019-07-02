import VueRouter from 'vue-router';
import IndexPage from '../components/IndexPage';
import Login from '../components/Login';
import Register from '../components/Register';

const routes = [
    {path: '/', name: 'index', component: IndexPage},
    {path: '/login', name: 'login', component: Login},
    {path: '/register', name: 'register', component: Register},
];

const router = new VueRouter({
    routes // short for `routes: routes`
})

export default router;