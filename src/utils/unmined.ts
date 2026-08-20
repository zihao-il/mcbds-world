declare global {
    interface Window {
        Unmined: any
        UnminedMapProperties: any
        UnminedRegions: any
        UnminedPlayers: any
        UnminedCustomMarkers: any
    }
}

const loadedScripts = new Map<string, Promise<void>>()

function loadScript(src: string): Promise<void> {
    const oldPromise = loadedScripts.get(src)

    if (oldPromise) {
        return oldPromise
    }

    const promise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')

        script.src = src
        script.async = false

        script.onload = () => {
            resolve()
        }

        script.onerror = () => {
            reject(new Error(`加载脚本失败: ${src}`))
        }

        document.head.appendChild(script)
    })

    loadedScripts.set(src, promise)

    return promise
}

function removeScript(src: string) {
    const scripts = document.querySelectorAll(
        `script[src="${src}"]`
    )

    scripts.forEach(script => {
        script.remove()
    })

    loadedScripts.delete(src)
}

export async function loadUnminedCore() {
    await loadScript('/unmined/unmined.js')
}

export async function loadMapData(
    mapId: string,
    dimension: string
) {
    const basePath = `/maps/${mapId}/${dimension}`

    await loadScript(
        `${basePath}/unmined.map.properties.js`
    )

    await loadScript(
        `${basePath}/unmined.map.regions.js`
    )

    const playersPath =
        `${basePath}/unmined.map.players.js`

    const markersPath =
        `${basePath}/custom.markers.js`

    try {
        await loadScript(playersPath)
    } catch {
        console.warn(
            `没有找到 ${playersPath}`
        )
    }

    try {
        await loadScript(markersPath)
    } catch {
        console.warn(
            `没有找到 ${markersPath}`
        )
    }

    return {
        basePath,
        properties: window.UnminedMapProperties,
        regions: window.UnminedRegions
    }
}

export async function createUnminedMap(
    element: HTMLElement,
    mapId: string,
    dimension: string
) {
    await loadUnminedCore()

    const {
        basePath,
        properties,
        regions
    } = await loadMapData(
        mapId,
        dimension
    )

    if (!window.Unmined) {
        throw new Error(
            'uNmINeD 未正确加载'
        )
    }

    if (!properties) {
        throw new Error(
            'UnminedMapProperties 未加载'
        )
    }

    if (!regions) {
        throw new Error(
            'UnminedRegions 未加载'
        )
    }

    const options = {
        ...properties,

        /*
         * uNmINeD 修改后的 tilePath
         */
        tilePath:
            `${basePath}/tiles`,

        /*
         * 固定资源
         */
        playerImagePath:
            '/unmined/playerimages',

        customPin:
            '/unmined/custom.pin.png'
    }

    /*
     * custom.markers.js
     */
    if (
        window.UnminedCustomMarkers &&
        window.UnminedCustomMarkers.isEnabled &&
        window.UnminedCustomMarkers.markers
    ) {
        options.markers = [
            ...(options.markers ?? []),
            ...window.UnminedCustomMarkers.markers
        ]
    }

    /*
     * 玩家
     */
    if (
        window.UnminedPlayers &&
        window.UnminedPlayers.length > 0
    ) {
        options.playerMarkers =
            window.Unmined.createPlayerMarkers(
                window.UnminedPlayers
            )
    }

    const instance =
        new window.Unmined(
            element,
            options,
            regions
        )

    return instance
}

export function cleanupMapScripts(
    mapId: string,
    dimension: string
) {
    const basePath =
        `/maps/${mapId}/${dimension}`

    removeScript(
        `${basePath}/unmined.map.properties.js`
    )

    removeScript(
        `${basePath}/unmined.map.regions.js`
    )

    removeScript(
        `${basePath}/unmined.map.players.js`
    )

    removeScript(
        `${basePath}/custom.markers.js`
    )

    /*
     * 删除旧的全局变量
     */
    delete window.UnminedMapProperties
    delete window.UnminedRegions
    delete window.UnminedPlayers
    delete window.UnminedCustomMarkers
}