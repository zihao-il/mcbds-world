<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import {
    dimensions,
    getMapById,
    type Dimension
} from '../config/maps'

const router = useRouter()
const route = useRoute()

function selectDimension(
    dimension: Dimension
) {
    const mapId =
        typeof route.params.mapId === 'string'
            ? route.params.mapId
            : ''

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
        <div class="selector-title">
            维度
        </div>

        <button
            v-for="dimension in dimensions"
            :key="dimension.id"
            class="dimension-item"
            :class="{
                active:
                    route.params.dimension ===
                    dimension.id
            }"
            @click="
                selectDimension(dimension.id)
            "
        >
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
    width: 100%;

    display: flex;
    align-items: center;

    gap: 10px;

    padding: 10px 12px;

    border: 0;
    border-radius: 8px;

    background: transparent;

    color: inherit;

    cursor: pointer;

    text-align: left;

    transition: background 0.2s;
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