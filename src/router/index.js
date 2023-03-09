import {createRouter, createWebHistory} from 'vue-router'
import List from '../views/List.vue'
import EditUser from "@/views/EditUser.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'list',
            component: List
        },
        {
            path: '/edit',
            name: 'edit',
            component: EditUser
        }
    ]
})

export default router
