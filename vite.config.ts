import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {compression, defineAlgorithm} from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(),

        compression({
            algorithms: [
                defineAlgorithm('gzip', {level: 6})
            ]
        }),
    ],
    server: {
        host: '0.0.0.0',
    },
})
