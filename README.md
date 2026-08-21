# mcbds-world

本来想把以前开的服务器的世界地图放上来，结果发现导出来的地图文件太大了，就塞了一张上来。

请使用[uNmINeD](https://unmined.net/)导出网页地图

## 地图存放目录

```text
mcbds-world/
├─ public/
│  └─ maps/
│     ├─ world-1/
│     │  ├─ overworld/ //主世界地图文件
│     │  ├─ nether/  //下界地图文件
│     │  └─ end/  //末地地图文件
│     ........

```

> **注意：** uNmINeD 导出的地图是一个完整的网页项目，需要塞入的文件请参考`public/maps/world-1`，生成的通用文件已放入`public/unmined`目录中，不需要他的`index.html`等其他文件，配置文件请预览`src/config/maps.ts`。

## 地图配置说明

```ts
export const maps = [
    {
        id: 'world-1',  // public/maps/world-1 对应的文件夹名字
        name: '服务器第一期',  // 说明
        date: '2019年',  // 时间
        description: '服务器第一张世界地图', // 详细说明
        dimensions: ['overworld', 'nether', 'end'],  // 对应维度，文件夹放在对应的id文件夹下面
    },
]
```

## 构建

执行：

```bash
pnpm build
```
