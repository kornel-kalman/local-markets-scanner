import {createRouter, createWebHistory} from 'vue-router';
import PlacesOverview from "@/components/PlacesOverview.vue";

const routes = [
    {path: '/', component: PlacesOverview},
    // { path: '/place/:id', component: PlaceDetail },
    // { path: '/create-place', component: CreatePlace },
    // { path: '/create-review/:placeId', component: CreateReview }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
