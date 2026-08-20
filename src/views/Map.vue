<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import MapSidebar from '../components/MapSidebar.vue'
import {getDimensionById, getMapById} from '../config/maps'
import {cleanupMapScripts, createUnminedMap} from '../utils/unmined'

const route = useRoute()
const router = useRouter()

const mapElement =
    ref<HTMLElement | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)

let unmined: any = null

let currentMapId = ''
let currentDimension = ''

async function loadMap() {
    if (!mapElement.value) {
        return
    }

    const mapId =
        typeof route.params.mapId === 'string'
            ? route.params.mapId
            : ''

    const dimension =
        typeof route.params.dimension === 'string'
            ? route.params.dimension
            : ''

    const map = getMapById(mapId)
    const dimensionConfig =
        getDimensionById(dimension)

    if (!map) {
        await router.replace('/')
        return
    }

    if (!dimensionConfig) {
        await router.replace({
            name: 'map',
            params: {
                mapId,
                dimension: 'overworld'
            }
        })

        return
    }

    if (!map.dimensions.includes(dimension as any)) {
        await router.replace({
            name: 'map',
            params: {
                mapId,
                dimension: 'overworld'
            }
        })

        return
    }

    loading.value = true
    error.value = null

    try {
        /*
         * 销毁旧地图
         */
        if (unmined) {
            if (
                typeof unmined.destroy ===
                'function'
            ) {
                unmined.destroy()
            }

            unmined = null
        }

        /*
         * 清理旧地图 JS
         */
        if (
            currentMapId &&
            currentDimension
        ) {
            cleanupMapScripts(
                currentMapId,
                currentDimension
            )
        }

        currentMapId = mapId
        currentDimension = dimension

        /*
         * 清空地图 DOM
         */
        mapElement.value.innerHTML = ''

        await nextTick()

        /*
         * 创建 uNmINeD
         */
        unmined =
            await createUnminedMap(
                mapElement.value,
                mapId,
                dimension
            )
    } catch (e) {
        console.error(e)

        error.value =
            e instanceof Error
                ? e.message
                : '地图加载失败'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadMap()
})

watch(
    () => [
        route.params.mapId,
        route.params.dimension
    ],
    () => {
        loadMap()
    }
)

onUnmounted(() => {
    if (unmined) {
        if (
            typeof unmined.destroy ===
            'function'
        ) {
            unmined.destroy()
        }

        unmined = null
    }

    if (
        currentMapId &&
        currentDimension
    ) {
        cleanupMapScripts(
            currentMapId,
            currentDimension
        )
    }
})
</script>

<template>
    <div class="map-page">
        <MapSidebar/>

        <main class="map-container">
            <div
                id="map"
                ref="mapElement"
            ></div>

            <div
                v-if="loading"
                class="loading"
            >
                <div class="loading-box">
                    正在加载地图...
                </div>
            </div>

            <div
                v-if="error"
                class="error"
            >
                <div class="error-box">
                    <div>
                        地图加载失败
                    </div>

                    <small>
                        {{ error }}
                    </small>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.map-page {
    display: flex;
    overflow: hidden;

    width: 100vw;

    height: 100vh;
}

.map-container {
    position: relative;

    flex: 1;

    min-width: 0;
    min-height: 0;
}

#map {
    width: 100%;
    height: 100%;
}

.loading,
.error {
    position: absolute;

    display: flex;

    align-items: center;

    justify-content: center;
    pointer-events: none;

    inset: 0;
}

.loading-box,
.error-box {
    padding: 16px 24px;

    color: white;

    border-radius: 12px;

    background: rgba(0, 0, 0, 0.75);

    backdrop-filter: blur(10px);
}

.error-box {
    text-align: center;
}

.error-box small {
    display: block;

    margin-top: 8px;

    opacity: 0.7;
}
</style>