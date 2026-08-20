export type Dimension = 'overworld' | 'nether' | 'end'

export interface DimensionConfig {
    id: Dimension
    name: string
    icon: string
}

export interface MapConfig {
    id: string
    name: string
    date: string
    description?: string
    dimensions: Dimension[]
}

export const dimensions: DimensionConfig[] = [
    {
        id: 'overworld',
        name: '主世界',
        icon: '🌎'
    },
    {
        id: 'nether',
        name: '下界',
        icon: '🔥'
    },
    {
        id: 'end',
        name: '末地',
        icon: '🌌'
    }
]

export const maps: MapConfig[] = [
    {
        id: 'world-1',
        name: '服务器第一期',
        date: '2024',
        description: '服务器第一期世界地图',
        dimensions: ['overworld', 'nether']
    },
    {
        id: 'world-2',
        name: '服务器第二期',
        date: '2025',
        description: '服务器第二期世界地图',
        dimensions: ['overworld', 'nether', 'end']
    }
]

export function getMapById(id: string): MapConfig | undefined {
    return maps.find(map => map.id === id)
}

export function getDimensionById(
    id: string
): DimensionConfig | undefined {
    return dimensions.find(dimension => dimension.id === id)
}