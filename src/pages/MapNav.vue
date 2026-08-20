<script lang="ts" setup>
const worlds = [
    {
        name: '地图 1',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world1', icon: '🌍'},
            {label: '下界', path: '/world1_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 2',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world2', icon: '🌍'},
            {label: '下界', path: '/world2_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 3',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world3', icon: '🌍'},
            {label: '下界', path: '/world3_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 4',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world4', icon: '🌍'},
            {label: '下界', path: '/world4_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 5',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world5', icon: '🌍'},
            {label: '下界', path: '/world5_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 6',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world6', icon: '🌍'},
            {label: '下界', path: '/world6_nether', icon: '🔥'},
        ]
    },
    {
        name: '地图 7',
        launchTime: '2026-08-20 10:00',
        entries: [
            {label: '主世界', path: '/world7', icon: '🌍'},
            {label: '下界', path: '/world7_nether', icon: '🔥'},
        ]
    },
]
</script>

<template>
    <div class="map-nav">
        <header class="nav-header">
            <h1>🗺️ 基岩版服务器地图预览</h1>
            <p class="subtitle">点击进入查看地图</p>
        </header>

        <div class="map-grid">
            <div v-for="world in worlds" :key="world.name" class="map-card">
                <div class="card-header">
                    <span class="world-icon">🗺️</span>
                    <span class="world-name">{{ world.name }}</span>
                    <span class="launch-time">🕒 {{ world.launchTime }}</span>
                </div>
                <div class="entry-list">
                    <a
                        v-for="entry in world.entries"
                        :key="entry.path"
                        :href="entry.path + '/'"
                        class="entry-link"
                    >
                        <span class="entry-icon">{{ entry.icon }}</span>
                        <span class="entry-label">{{ entry.label }}</span>
                        <span class="entry-arrow">→</span>
                    </a>
                </div>
            </div>
        </div>

        <footer class="nav-footer">
            <p>MC基岩版服务器 · 地图预览</p>
        </footer>
    </div>
</template>

<style scoped>
.map-nav {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    min-height: 100vh;
    margin: 0 auto;
    padding: 40px 20px;
}

.nav-header {
    margin-bottom: 48px;
    text-align: center;
}

.nav-header h1 {
    font-size: 42px;
    font-weight: 700;
    margin: 0 0 8px;
    color: var(--text-h);
}

.subtitle {
    font-size: 18px;
    opacity: 0.8;
    color: var(--text);
}

.map-grid {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
}

.map-card {
    padding: 20px 16px 16px;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--code-bg);
}

.map-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
}

.card-header {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
}

.world-icon {
    font-size: 22px;
}

.world-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-h);
}

.launch-time {
    font-size: 13px;
    margin-left: auto;
    padding: 2px 10px;
    white-space: nowrap;
    opacity: 0.7;
    color: var(--text);
    border-radius: 12px;
    background: var(--bg, #F5F7FA);
}

.entry-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.entry-link {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    transition: background 0.15s, transform 0.15s;
    text-decoration: none;
    color: var(--text-h);
    border-radius: 10px;
    background: var(--bg, #F5F7FA);
    gap: 10px;
}

.entry-link:hover {
    transform: scale(1.01);
    background: var(--border, #E2E8F0);
}

.entry-icon {
    font-size: 20px;
    flex-shrink: 0;
}

.entry-label {
    font-size: 15px;
    font-weight: 500;
    flex: 1;
}

.entry-arrow {
    font-size: 14px;
    opacity: 0.4;
    color: var(--text);
}

.nav-footer {
    font-size: 14px;
    margin-top: 40px;
    padding-top: 40px;
    text-align: center;
    opacity: 0.7;
    color: var(--text);
    border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
    .map-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .nav-header h1 {
        font-size: 28px;
    }

    .launch-time {
        width: 100%;
        margin-left: 0;
        text-align: left;
    }
}
</style>