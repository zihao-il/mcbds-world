<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { maps } from '../config/maps'

const router = useRouter()
const route = useRoute()

function selectMap(mapId: string) {
    const dimension =
        typeof route.params.dimension === 'string'
            ? route.params.dimension
            : 'overworld'

    router.push({
        name: 'map',
        params: {
            mapId,
            dimension
        }
    })
}
</script>

<template>
    <div class="map-selector">
        <div class="selector-title">
            世界地图
        </div>

        <div
            v-for="map in maps"
            :key="map.id"
            class="map-item"
            :class="{
                active:
                    route.params.mapId === map.id
            }"
            @click="selectMap(map.id)"
        >
            <div class="map-name">
                {{ map.name }}
            </div>

            <div class="map-date">
                {{ map.date }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.map-selector {
    padding: 12px;
}

.selector-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    opacity: 0.7;
}

.map-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px 12px;
    margin-bottom: 6px;

    border-radius: 8px;
    cursor: pointer;

    transition:
        background-color 0.2s,
        transform 0.2s;
}

.map-item:hover {
    background: rgba(128, 128, 128, 0.12);
}

.map-item.active {
    background: rgba(64, 128, 255, 0.15);
}

.map-name {
    font-size: 14px;
}

.map-date {
    font-size: 12px;
    opacity: 0.5;
}
</style>