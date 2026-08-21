<script lang="ts" setup>
import MapSelector from './MapSelector.vue'
import DimensionSelector from './DimensionSelector.vue'

defineProps<{
    mobile?: boolean
}>()

const emit = defineEmits<{
    close: []
}>()
</script>

<template>
    <aside
        :class="{
            mobile
        }"
        class="sidebar"
    >
        <div class="sidebar-header">
            <div>
                <div class="title">
                    Minecraft 世界地图
                </div>

                <div class="subtitle">
                    地图导航
                </div>
            </div>

            <!-- 手机关闭按钮 -->
            <button
                v-if="mobile"
                class="close-button"
                @click="emit('close')"
            >
                ×
            </button>
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
    z-index: 100;
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
    display: flex;
    align-items: center;
    justify-content: space-between;

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

.close-button {
    font-size: 24px;
    line-height: 1;

    width: 36px;
    height: 36px;

    cursor: pointer;

    color: inherit;

    border: 0;
    border-radius: 50%;

    background: rgba(128, 128, 128, 0.12);
}

/*
 * 手机
 */
@media (max-width: 768px) {
    .sidebar {
        position: fixed;

        top: 0;
        bottom: 0;
        left: 0;

        width: min(82vw, 300px);

        border-right: 1px solid rgba(128, 128, 128, 0.2);

        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.18);
    }
}
</style>