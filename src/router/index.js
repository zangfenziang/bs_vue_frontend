import VueRouter from 'vue-router';
import IndexPage from '../components/IndexPage';

const routes = [
    {path: '/', component: IndexPage}
];

const router = new VueRouter({
    routes // short for `routes: routes`
})

export default router;