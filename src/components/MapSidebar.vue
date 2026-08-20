<script lang="ts" setup>
import MapSelector from './MapSelector.vue'
import DimensionSelector from './DimensionSelector.vue'
</script>

<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="title">
                Minecraft 世界地图
            </div>

            <div class="subtitle">
                地图导航
            </div>
        </div>

        <div class="sidebar-content">
            <MapSelector/>

            <div class="divider"></div>

            <DimensionSelector/>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    display: flex;
    overflow: hidden;

    flex-direction: column;

    flex-shrink: 0;
    width: 260px;

    height: 100%;

    border-right: 1px solid rgba(128, 128, 128, 0.2);

    background: var(--sidebar-bg, #FFFFFF);
}

.sidebar-header {
    padding: 20px 16px 14px;
}

.title {
    font-size: 18px;
    font-weight: 700;
}

.subtitle {
    font-size: 12px;

    margin-top: 4px;

    opacity: 0.55;
}

.sidebar-content {
    overflow-y: auto;

    flex: 1;
}

.divider {
    height: 1px;

    margin: 4px 12px;

    background: rgba(128, 128, 128, 0.15);
}

@media (max-width: 768px) {
    .sidebar {
        width: 220px;
    }
}
</style>