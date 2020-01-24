<template>
    <div class="bg-gray-200 rounded w-1/2 mx-auto p-8">
        <h2 class="text-xl">Monitors</h2>
        <div class="text-left mt-6">
            <div>
                <p class="text-lg">totalJSHeapSize: {{ totalJSHeapSize.toLocaleString() }} bytes ({{ mb(totalJSHeapSize).toLocaleString() }} MB)</p>
                <p class="text-xs">The total allocated heap size.</p>
            </div>
            <div class="mt-4">
                <p class="text-lg">usedJSHeapSize: {{ usedJSHeapSize.toLocaleString() }} bytes ({{ mb(usedJSHeapSize).toLocaleString()  }} MB)</p>
                <p class="text-xs">The currently active segment of JS heap.</p>
            </div>
            <div class="mt-4">
                <p class="text-lg">jsHeapSizeLimit: {{ jsHeapSizeLimit.toLocaleString() }} bytes ({{ mb(jsHeapSizeLimit).toLocaleString() }} MB)</p>
                <p class="text-xs">The maximum size of the heap that is available to the context.</p>
            </div>
        </div>
    </div>
</template>

<script>
 import { mb } from '@/utils'

 export default {
     name: 'Monitors',

     data() {
         return {
             totalJSHeapSize: 0,
             usedJSHeapSize: 0,
             jsHeapSizeLimit: 0,
         }
     },

     methods: {
         mb(bytes) {
             return mb(bytes)
         }
     },

     created() {
         setInterval(() => {
             this.totalJSHeapSize = window.performance.memory.totalJSHeapSize
             this.usedJSHeapSize = window.performance.memory.usedJSHeapSize
             this.jsHeapSizeLimit = window.performance.memory.jsHeapSizeLimit
         }, 1000)
     }
 }
</script>
