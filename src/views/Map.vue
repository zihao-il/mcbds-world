<script setup lang="ts">
import {
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    watch
} from 'vue'

import { useRoute, useRouter } from 'vue-router'

import MapSidebar from '../components/MapSidebar.vue'

import {
    getMapById,
    getDimensionById
} from '../config/maps'

import {
    createUnminedMap,
    cleanupMapScripts
} from '../utils/unmined'

const route = useRoute()
const router = useRouter()

const mapElement =
    ref<HTMLElement | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)

const sidebarOpen = ref(false)

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

        currentMapId = mapId
        currentDimension = dimension

        mapElement.value.innerHTML = ''

        await nextTick()

        unmined =
            await createUnminedMap(
                mapElement.value,
                mapId,
                dimension
            )

        // 手机切换地图后自动关闭菜单
        sidebarOpen.value = false
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

function toggleSidebar() {
    sidebarOpen.value =
        !sidebarOpen.value
}

function closeSidebar() {
    sidebarOpen.value = false
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

        <!-- PC Sidebar -->
        <MapSidebar
            class="desktop-sidebar"
        />

        <!-- 手机 Sidebar -->
        <Transition name="sidebar">
            <MapSidebar
                v-if="sidebarOpen"
                class="mobile-sidebar"
                mobile
                @close="closeSidebar"
            />
        </Transition>

        <!-- 手机遮罩 -->
        <Transition name="overlay">
            <div
                v-if="sidebarOpen"
                class="mobile-overlay"
                @click="closeSidebar"
            ></div>
        </Transition>

        <main class="map-container">

            <!-- 手机顶部工具栏 -->
            <div class="mobile-toolbar">

                <button
                    class="menu-button"
                    @click="toggleSidebar"
                >
                    ☰
                </button>

                <div class="toolbar-title">
                    {{ getMapById(
                    String(route.params.mapId)
                )?.name }}
                </div>

                <div class="toolbar-dimension">
                    {{
                        getDimensionById(
                            String(route.params.dimension)
                        )?.icon
                    }}
                </div>
            </div>

            <!-- 地图 -->
            <div
                ref="mapElement"
                id="map"
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
    width: 100vw;
    height: 100vh;

    display: flex;

    overflow: hidden;
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

/*
 * 手机工具栏
 */
.mobile-toolbar {
    display: none;
}

/*
 * 手机 Sidebar 默认隐藏
 */
.mobile-sidebar {
    display: none;
}

/*
 * 遮罩
 */
.mobile-overlay {
    display: none;
}

.loading,
.error {
    position: absolute;

    inset: 0;

    display: flex;

    align-items: center;
    justify-content: center;

    pointer-events: none;
}

.loading-box,
.error-box {
    padding: 16px 24px;

    border-radius: 12px;

    background: rgba(0, 0, 0, 0.75);

    color: white;

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

/* =========================
   手机
   ========================= */

@media (max-width: 768px) {

    .desktop-sidebar {
        display: none;
    }

    .mobile-sidebar {
        display: flex;

        position: fixed;

        top: 0;
        left: 0;
        bottom: 0;

        z-index: 1001;
    }

    .mobile-toolbar {
        position: absolute;

        top: env(
            safe-area-inset-top,
            0px
        );

        left: 0;
        right: 0;

        height: 52px;

        display: flex;

        align-items: center;

        gap: 10px;

        padding:
            6px 10px;

        z-index: 100;

        pointer-events: none;
    }

    .menu-button {
        width: 42px;
        height: 42px;

        flex-shrink: 0;

        border: 0;

        border-radius: 12px;

        background: rgba(
            255,
            255,
            255,
            0.9
        );

        color: #222;

        font-size: 20px;

        box-shadow:
            0 2px 10px
            rgba(0, 0, 0, 0.18);

        cursor: pointer;

        pointer-events: auto;
    }

    .toolbar-title {
        max-width: 180px;

        overflow: hidden;

        white-space: nowrap;

        text-overflow: ellipsis;

        padding: 8px 12px;

        border-radius: 10px;

        background: rgba(
            255,
            255,
            255,
            0.9
        );

        font-size: 14px;
        font-weight: 600;

        box-shadow:
            0 2px 10px
            rgba(0, 0, 0, 0.12);
    }

    .toolbar-dimension {
        width: 40px;
        height: 40px;

        display: flex;

        align-items: center;
        justify-content: center;

        margin-left: auto;

        border-radius: 12px;

        background: rgba(
            255,
            255,
            255,
            0.9
        );

        font-size: 20px;

        box-shadow:
            0 2px 10px
            rgba(0, 0, 0, 0.12);
    }

    .mobile-overlay {
        display: block;

        position: fixed;

        inset: 0;

        z-index: 1000;

        background:
            rgba(0, 0, 0, 0.35);

        backdrop-filter: blur(2px);
    }

    /*
     * Sidebar 滑入
     */
    .sidebar-enter-active,
    .sidebar-leave-active {
        transition:
            transform 0.25s ease;
    }

    .sidebar-enter-from,
    .sidebar-leave-to {
        transform:
            translateX(-100%);
    }

    /*
     * 遮罩淡入
     */
    .overlay-enter-active,
    .overlay-leave-active {
        transition:
            opacity 0.2s ease;
    }

    .overlay-enter-from,
    .overlay-leave-to {
        opacity: 0;
    }

    #map {
        width: 100%;
        height: 100%;
    }
}
</style>