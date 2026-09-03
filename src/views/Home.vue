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


// 将 Tick 转换为可读时间格式（天、时、分、秒）
function formatWorldAge(ticks: bigint | number): string {
    if (ticks === undefined || ticks === null) return '未知'
    // 统一转为 number（BigInt 可能超出 Number 范围，但 Minecraft 的 Time 值在安全范围内）
    const ticksNum = typeof ticks === 'bigint' ? Number(ticks) : ticks
    if (ticksNum < 0) return '未知'
    const totalSeconds = Math.floor(ticksNum / 20)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (days > 0) {
        return `${days}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// 将 Unix 时间戳（秒级）转换为本地日期时间字符串
function formatLastPlayed(timestamp: bigint | number): string {
    if (timestamp === undefined || timestamp === null) return '未知'
    const tsNum = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp
    if (tsNum < 0) return '未知'
    const date = new Date(tsNum * 1000)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

function formatWorldDays(tick: number): string {
    if (tick === undefined || tick === null) return '未知'
    const tickNum = typeof tick === 'bigint' ? Number(tick) : tick
    if (tickNum < 0) return '未知'
    const days = Math.floor(tickNum / 24000)
    return `${days} 天`
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
                        <div v-if="levelData[map.id].lastOpenedWithVersion">
                            <span class="version-label">最终版本：</span>
                            <span class="version-value">{{
                                    formatVersion(levelData[map.id].lastOpenedWithVersion)
                                }}</span>
                        </div>
                        <div v-if="levelData[map.id].Time">
                            <span class="version-label">世界天数：</span>
                            <span class="version-value">{{ formatWorldDays(levelData[map.id].Time) }}</span>
                        </div>
                        <div v-if="levelData[map.id].Time">
                            <span class="version-label">游戏时长：</span>
                            <span class="version-value">{{ formatWorldAge(levelData[map.id].Time) }}</span>
                        </div>
                        <div v-if="levelData[map.id].LastPlayed">
                            <span class="version-label">最后游玩：</span>
                            <span class="version-value">{{ formatLastPlayed(levelData[map.id].LastPlayed) }}</span>
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