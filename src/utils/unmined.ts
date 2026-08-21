declare global {
    interface Window {
        Unmined: any
        UnminedMapProperties: any
        UnminedRegions: any
        UnminedPlayers: any
        UnminedCustomMarkers: any
    }
}

const loadedScripts =
    new Map<string, Promise<void>>()

function loadScript(
    src: string
): Promise<void> {

    const cached =
        loadedScripts.get(src)

    if (cached) {
        return cached
    }

    const promise =
        new Promise<void>(
            (resolve, reject) => {

                const script =
                    document.createElement(
                        'script'
                    )

                script.src = src
                script.async = false

                script.onload = () => {
                    resolve()
                }

                script.onerror = () => {
                    reject(
                        new Error(
                            `加载失败: ${src}`
                        )
                    )
                }

                document.head.appendChild(
                    script
                )
            }
        )

    loadedScripts.set(
        src,
        promise
    )

    return promise
}

export async function createUnminedMap(
    element: HTMLElement,
    mapId: string,
    dimension: string
) {
    /*
     * 1. 加载 OpenLayers
     */
    await loadScript(
        '/unmined/lib/ol.js'
    )

    /*
     * 2. Context Menu
     */
    await loadScript(
        '/unmined/lib/ol-contextmenu.iife.js'
    )

    /*
     * 3. Toastify
     */
    await loadScript(
        '/unmined/lib/toastify-js.js'
    )

    /*
     * 4. uNmINeD 引擎
     */
    await loadScript(
        '/unmined/unmined.js'
    )

    /*
     * 5. 当前地图数据
     */
    const base =
        `/maps/${mapId}/${dimension}`


    await loadStyle(
        `/unmined/index.css`
    )


    /*
     * 清理旧数据
     */
    delete window.UnminedMapProperties
    delete window.UnminedRegions
    delete window.UnminedPlayers
    delete window.UnminedCustomMarkers

    /*
     * properties
     */
    await loadScript(
        `${base}/unmined.map.properties.js`
    )

    /*
     * regions
     */
    await loadScript(
        `${base}/unmined.map.regions.js`
    )

    /*
     * players
     */
    await loadScript(
        `${base}/unmined.map.players.js`
    )

    /*
     * markers
     */
    await loadScript(
        `${base}/custom.markers.js`
    )

    if (!window.Unmined) {
        throw new Error(
            'uNmINeD 未正确加载'
        )
    }

    if (!window.UnminedMapProperties) {
        throw new Error(
            '地图 properties 未加载'
        )
    }

    if (!window.UnminedRegions) {
        throw new Error(
            '地图 regions 未加载'
        )
    }

    /*
     * 当前地图配置
     */
    const options = {
        ...window.UnminedMapProperties,

        tilePath:
            `${base}/tiles`,

        /*
         * 玩家头像
         */
        playerImagePath:
            '/unmined/playerimages'
    }

    /*
     * 玩家
     */
    if (
        window.UnminedPlayers &&
        window.UnminedPlayers.length
    ) {
        options.playerMarkers =
            window.Unmined.createPlayerMarkers(
                window.UnminedPlayers
            )
    }

    /*
     * 自定义 Marker
     */
    if (
        window.UnminedCustomMarkers &&
        window.UnminedCustomMarkers.isEnabled
    ) {
        options.markers =
            [
                ...(options.markers ?? []),
                ...(window.UnminedCustomMarkers.markers ?? [])
            ]
    }

    /*
     * 创建
     */
    return new window.Unmined(
        element,
        options,
        window.UnminedRegions
    )
}

export function cleanupMapScripts(
    mapId: string,
    dimension: string
) {
    const base =
        `/maps/${mapId}/${dimension}`

    const scripts = [
        `${base}/unmined.map.properties.js`,
        `${base}/unmined.map.regions.js`,
        `${base}/unmined.map.players.js`,
        `${base}/custom.markers.js`
    ]

    for (const src of scripts) {
        const script =
            document.querySelector(
                `script[src="${src}"]`
            )

        script?.remove()

        loadedScripts.delete(src)
    }

    /*
     * 清除旧地图的全局变量
     */
    delete window.UnminedMapProperties
    delete window.UnminedRegions
    delete window.UnminedPlayers
    delete window.UnminedCustomMarkers
}

const loadedStyles = new Set<string>()

function loadStyle(href: string): Promise<void> {
    if (loadedStyles.has(href)) {
        return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link')

        link.rel = 'stylesheet'
        link.type = 'text/css'
        link.href = href

        link.onload = () => {
            loadedStyles.add(href)
            resolve()
        }

        link.onerror = () => {
            console.error(
                '[uNmINeD] CSS 加载失败:',
                href
            )

            reject(
                new Error(
                    `CSS 加载失败: ${href}`
                )
            )
        }

        document.head.appendChild(link)

        console.log(
            '[uNmINeD] 加载 CSS:',
            href
        )
    })
}