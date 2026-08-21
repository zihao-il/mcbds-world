<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import {type Dimension, dimensions, getMapById} from '../config/maps'

const router = useRouter()
const route = useRoute()

function selectDimension(dimension: Dimension) {
    const mapId = typeof route.params.mapId === 'string' ? route.params.mapId : ''
    const map = getMapById(mapId)
    if (!map) {
        return
    }
    if (!map.dimensions.includes(dimension)) {
        return
    }
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
    <div class="dimension-selector">
        <div class="selector-title">维度</div>

        <button
            v-for="dimension in dimensions"
            :key="dimension.id"
            :class="{
                active:
                    route.params.dimension ===
                    dimension.id
            }"
            class="dimension-item"
            @click="selectDimension(dimension.id)">
            <span class="icon">
                {{ dimension.icon }}
            </span>

            <span>
                {{ dimension.name }}
            </span>
        </button>
    </div>
</template>

<style scoped>
.dimension-selector {
    padding: 12px;
}

.selector-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    opacity: 0.7;
}

.dimension-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 12px;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
    color: inherit;
    border: 0;
    border-radius: 8px;
    background: transparent;
    gap: 10px;
}

.dimension-item:hover {
    background: rgba(128, 128, 128, 0.12);
}

.dimension-item.active {
    background: rgba(64, 128, 255, 0.15);
}

.icon {
    width: 24px;
    text-align: center;
}
</style>