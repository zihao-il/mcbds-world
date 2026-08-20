export type Dimension = 'overworld' | 'nether' | 'end'

export interface MapConfig {
    id: string
    name: string
    date: string
    dimensions: Dimension[]
}

export const maps: MapConfig[] = [
    {
        id: 'world-1',
        name: '服务器第一期',
        date: '2024',
        dimensions: ['overworld', 'nether']
    },
    {
        id: 'world-2',
        name: '服务器第二期',
        date: '2025',
        dimensions: ['overworld', 'nether', 'end']
    }
]