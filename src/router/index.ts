import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },

    {
        path: '/maps/:mapId/:dimension',
        name: 'map',
        component: () => import('../views/Map.vue')
    },

    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),

    routes,

    scrollBehavior() {
        return {
            top: 0
        }
    }
})

export default router