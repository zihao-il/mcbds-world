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


import overworldIcon from '../assets/overworld.png'
import netherIcon from '../assets/nether.png'
import endIcon from '../assets/end.png'


export const dimensions: DimensionConfig[] = [{
    id: 'overworld', name: '主世界', icon: overworldIcon
}, {
    id: 'nether', name: '下界', icon: netherIcon
}, {
    id: 'end', name: '末地', icon: endIcon
}]

export const maps: MapConfig[] = [{
    id: 'world-1',
    name: '服务器第一期',
    date: '2019年',
    description: '服务器第一张世界地图',
    dimensions: ['overworld', 'nether']
}, {
    id: 'world-2',
    name: '服务器第二期',
    date: '2020年寒假',
    description: '服务器第二张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-3',
    name: '服务器第三期',
    date: '2020年暑假',
    description: '服务器第三张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-4',
    name: '服务器第四期',
    date: '2021年寒假',
    description: '服务器第四张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-5',
    name: '服务器第五期',
    date: '2021年暑假',
    description: '服务器第五张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-6',
    name: '服务器第六期',
    date: '2022年寒假',
    description: '服务器第六张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-7',
    name: '服务器第七期',
    date: '2022年暑假',
    description: '服务器第七张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'world-8',
    name: '服务器第八期',
    date: '2023年寒假',
    description: '服务器第八张世界地图',
    dimensions: ['overworld', 'nether', 'end']
}, {
    id: 'realm',
    name: '领域器',
    date: '2024年5月至今',
    description: '领域服部分区块地图',
    dimensions: ['overworld']
}]

export function getMapById(id: string): MapConfig | undefined {
    return maps.find(map => map.id === id)
}

export function getDimensionById(id: string): DimensionConfig | undefined {
    return dimensions.find(dimension => dimension.id === id)
}