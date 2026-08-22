const TAG_END = 0
const TAG_BYTE = 1
const TAG_SHORT = 2
const TAG_INT = 3
const TAG_LONG = 4
const TAG_FLOAT = 5
const TAG_DOUBLE = 6
const TAG_BYTE_ARRAY = 7
const TAG_STRING = 8
const TAG_LIST = 9
const TAG_COMPOUND = 10
const TAG_INT_ARRAY = 11
const TAG_LONG_ARRAY = 12

class Reader {
    private view: DataView
    private offset = 0

    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer)
    }

    get position() {
        return this.offset
    }

    readByte() {
        const value = this.view.getInt8(this.offset)
        this.offset += 1
        return value
    }

    readUnsignedByte() {
        const value = this.view.getUint8(this.offset)
        this.offset += 1
        return value
    }

    readShort() {
        const value = this.view.getInt16(this.offset, true)
        this.offset += 2
        return value
    }

    readInt() {
        const value = this.view.getInt32(this.offset, true)
        this.offset += 4
        return value
    }

    readLong() {
        const value = this.view.getBigInt64(this.offset, true)
        this.offset += 8
        return value
    }

    readFloat() {
        const value = this.view.getFloat32(this.offset, true)
        this.offset += 4
        return value
    }

    readDouble() {
        const value = this.view.getFloat64(this.offset, true)
        this.offset += 8
        return value
    }

    readString() {
        const length = this.view.getUint16(this.offset, true)
        this.offset += 2
        const bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length)
        this.offset += length
        return new TextDecoder().decode(bytes)
    }

    readBytes(length: number) {
        const bytes = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length)
        this.offset += length
        return new Uint8Array(bytes)
    }
}

function readPayload(reader: Reader, type: number): any {
    switch (type) {
        case TAG_BYTE:
            return reader.readByte()
        case TAG_SHORT:
            return reader.readShort()
        case TAG_INT:
            return reader.readInt()
        case TAG_LONG:
            return reader.readLong()
        case TAG_FLOAT:
            return reader.readFloat()
        case TAG_DOUBLE:
            return reader.readDouble()
        case TAG_BYTE_ARRAY: {
            const length = reader.readInt()
            return reader.readBytes(length)
        }

        case TAG_STRING:
            return reader.readString()

        case TAG_LIST: {
            const childType = reader.readUnsignedByte()
            const length = reader.readInt()
            const result = []
            for (let i = 0; i < length; i++) {
                result.push(readPayload(reader, childType))
            }
            return result
        }

        case TAG_COMPOUND: {
            const result: Record<string, any> = {}
            while (true) {
                const childType = reader.readUnsignedByte()
                if (childType === TAG_END) {
                    break
                }
                const name = reader.readString()
                result[name] = readPayload(reader, childType)
            }
            return result
        }

        case TAG_INT_ARRAY: {
            const length = reader.readInt()
            const result = []
            for (let i = 0; i < length; i++) {
                result.push(reader.readInt())
            }
            return result
        }

        case TAG_LONG_ARRAY: {
            const length = reader.readInt()
            const result: bigint[] = []
            for (let i = 0; i < length; i++) {
                result.push(reader.readLong())
            }
            return result
        }
        default:
            throw new Error(`未知 NBT Tag: ${type}`)
    }
}

export interface BedrockLevelDat {
    [key: string]: any
}

export function parseLevelDat(buffer: ArrayBuffer): BedrockLevelDat {
    if (buffer.byteLength < 8) {
        throw new Error('level.dat 文件太小')
    }

    // const header = new DataView(buffer)

    /*
     * Bedrock level.dat:
     *
     * offset 0:
     *   version
     *
     * offset 4:
     *   NBT size
     */
    // const version = header.getInt32(0, true)
    // const nbtSize = header.getInt32(4, true)
    // console.log('level.dat version:', version)
    // console.log('NBT size:', nbtSize)
    const nbtBuffer = buffer.slice(8)
    const reader = new Reader(nbtBuffer)
    const rootType = reader.readUnsignedByte()
    if (rootType !== TAG_COMPOUND) {
        throw new Error(`不是 Compound NBT，Tag=${rootType}`)
    }

    // Root 名称
    reader.readString()
    return readPayload(reader, TAG_COMPOUND)
}

export async function loadLevelDat(mapId: string) {
    const url = `/maps/${mapId}/level.dat`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(
            `无法读取 level.dat: ${url}`
        )
    }
    const buffer = await response.arrayBuffer()
    return parseLevelDat(buffer)
}