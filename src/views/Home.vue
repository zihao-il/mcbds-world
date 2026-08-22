<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {dimensions, maps} from '../config/maps'
import {loadLevelDat} from '../utils/levelDat'
import {onMounted, ref} from 'vue'

const router = useRouter()
const levelData = ref<Record<string, any>>({})

async function loadAllLevelData() {
    await Promise.all(maps.map(async (map) => {
        try {
            console.log(loadLevelDat(map.id))
            levelData.value[map.id] = await loadLevelDat(map.id)
        } catch (error) {
            console.error(`加载 ${map.id} 的 level.dat 失败:`, error)
        }
    }))
}

function formatVersion(versionArray: number[]): string {
    if (!versionArray || versionArray.length < 2) return ''
    return versionArray.slice(0, -2).join('.')
}

onMounted(() => {
    loadAllLevelData()
})


function openMap(
    mapId: string,
    dimension: string
) {
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
    <main class="home">
        <div class="container">
            <header class="header">
                <h1>MCBDS 世界地图</h1>
                <p>服务器世界地图纪念馆</p>
            </header>
            <div class="map-grid">
                <div
                    v-for="map in maps"
                    :key="map.id"
                    class="map-card">
                    <div class="card-header">
                        <div>
                            <h2>{{ map.name }}</h2>
                            <span>{{ map.date }}</span>
                        </div>
                    </div>

                    <p v-if="map.description" class="description">{{ map.description }}</p>


                    <div v-if="levelData[map.id]" class="version-info">
                        <div v-if="levelData[map.id].MinimumCompatibleClientVersion">
                            <span class="version-label">开服版本：</span>
                            <span class="version-value">{{
                                    formatVersion(levelData[map.id].MinimumCompatibleClientVersion)
                                }}</span>
                        </div>
                        <div v-if="levelData[map.id].lastOpenedWithVersion">
                            <span class="version-label">最后版本：</span>
                            <span class="version-value">{{
                                    formatVersion(levelData[map.id].lastOpenedWithVersion)
                                }}</span>
                        </div>
                    </div>

                    <div class="dimensions">
                        <template
                            v-for="dimension in dimensions"
                            :key="dimension.id"
                        >
                            <button
                                v-if="map.dimensions.includes(dimension.id)"
                                @click="openMap(map.id, dimension.id)">
                                <img :alt="dimension.name" :src="dimension.icon"/>
                                {{ dimension.name }}
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.home {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 40px 24px;
}

.container {
    width: min(1200px, 100%);
    margin: 0 auto;
}

.header {
    margin-bottom: 32px;
}

.header h1 {
    font-size: 32px;
    margin: 0;
}

.header p {
    margin-top: 8px;
    opacity: 0.6;
}

.map-grid {
    display: grid;
    grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
}

.map-card {
    padding: 20px;
    border: 1px solid rgba(128, 128, 128, 0.15);
    border-radius: 16px;
    background: rgba(128, 128, 128, 0.08);
}

.card-header {
    display: flex;
    justify-content: space-between;
}

.card-header h2 {
    font-size: 20px;
    margin: 0;
}

.card-header span {
    font-size: 13px;
    display: block;
    margin-top: 5px;
    opacity: 0.5;
}

.description {
    font-size: 14px;
    margin: 16px 0;
    opacity: 0.7;
}

.dimensions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.dimensions button {
    padding: 8px 12px;
    cursor: pointer;
    color: inherit;
    border: 0;
    border-radius: 8px;
    background: rgba(128, 128, 128, 0.12);
}

.dimensions button:hover {
    background: rgba(64, 128, 255, 0.2);
}

.version-info {
    font-size: 13px;
    margin: 12px 0;
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(128, 128, 128, 0.06);
}

.version-label {
    opacity: 0.6;
}

.version-value {
    font-family: monospace;
    font-weight: 500;
}


</style>