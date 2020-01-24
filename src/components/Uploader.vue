<template>
    <div class="hello">
        <div class="pt-24">
            <h1 class="text-3xl">Hi, upload a file to test things out...</h1>

            <button @click="$refs.input.click()" type="button" class="bg-green-700 hover:bg-green-600 text-white mt-6 px-6 py-2 rounded">
                <span v-if="file">Click to select a new file</span>
                <span v-else>Click to begin</span>
            </button>
            <input ref="input" hidden type="file" />
        </div>

        <transition name="fade">
            <div class="mt-16 w-1/4 mx-auto" v-if="file">
                <h2 class="text-xl">File Info</h2>
                <div class="text-left mt-4">
                    <p>File name: <span class="text-red-800">{{ file.name }}</span></p>
                    <p>Size: <span class="text-red-800">{{ file.size.toLocaleString() }} bytes ({{  mb(file.size).toLocaleString() }} MB)</span></p>
                    <p>Type: <span class="text-red-800">{{ file.type }}</span></p>
                </div>
            </div>
        </transition>
        <transition name="fade">
            <div class="mt-16 w-1/3 mx-auto" v-if="file">
                <p class="mt-8 mb-4">Chunk Size - {{ chunkSize.toLocaleString() }} bytes ({{ mb(chunkSize).toLocaleString() }} MB)</p>
                <input type="range" :min="chunkSizeMin" :max="chunkSizeMax" v-model="chunkSize" class="block mx-auto w-full">
                <div class="flex justify-between w-full">
                    <div class="text-xs">{{ chunkSizeMin.toLocaleString() }} bytes ({{  mb(chunkSizeMin).toLocaleString() }} MB)</div>
                    <div class="text-xs">{{ chunkSizeMax.toLocaleString() }} bytes ({{ mb(chunkSizeMax).toLocaleString() }} MB)</div>
                </div>
                <button @click="upload" type="button" class="bg-purple-600 hover:bg-purple-800 text-white mt-12 px-6 py-2 rounded">Begin Upload (~{{ totalChunks }} chunks)</button>
            </div>
        </transition>

        <div class="flex">
            <transition name="fade">
                <div class="mt-16 w-1/3 mx-auto bg-gray-700 text-white rounded p-4" v-if="currentChunk.length">
                    <h2 class="text-xl">File Contents - Chunk {{ currentChunkIndex }}</h2>
                    <div class="text-left mt-4">
                        <p v-for="(line, index) in currentChunk.split('\n')" :key="index">{{ line }}</p>
                    </div>
                </div>
            </transition>

            <transition name="fade">
                <Monitors class="mt-16" />
            </transition>
        </div>
    </div>
</template>

<script>
 import { mb, parseFile } from '@/utils';
 import Monitors from './Monitors.vue'

 export default {
     name: 'Uploader',

     components: {
         Monitors,
     },

     data() {
         return {
             file: null,
             chunkSize: 500,
             currentChunkIndex: 0,
             currentChunk: '',
             buffer: '',
             chunkSizeMin: 100,
             chunkSizeMax: 1000000000
         }
     },

     computed: {
         totalChunks() {
             if (!this.file) {
                 return 0
             }

             return Math.ceil(this.file.size / this.chunkSize)
         }
     },

     methods: {
         mb(value) {
             return mb(value)
         },

         reset() {
             this.buffer = ''
             this.currentChunk = ''
             this.currentChunkIndex = 0
         },

         selectFile(file) {
             this.reset()
             this.file = file
         },

         upload() {
             this.reset()
             parseFile(this.file, this.chunkSize, this.onProgress)
         },

         onProgress(chunk) {
             // Below is some extra logic because we don't just want to split
             // the data into chunks, but we will actually want to manipulate
             // the contents, line by line. So, we need to make sure we split
             // the data by line breaks.

             // Check if we have anything left over from a previous chunk
             const content = this.buffer + chunk

             // Get the index of the last line break in the chunk
             const lastNewLine = content.lastIndexOf('\n')

             // Take the current chunk up to the last new line
             this.currentChunk = content.slice(0, lastNewLine)

             // Save the leftover
             this.buffer = content.slice(lastNewLine + 1)

             this.currentChunkIndex++
         }
     },

     mounted() {
         this.$refs.input.onchange = () => this.selectFile(this.$refs.input.files[0])
     }
 }
</script>

<style scoped>
 .fade-enter-active, .fade-leave-active {
     transition: opacity .5s;
 }
 .fade-enter, .fade-leave-to {
     opacity: 0;
 }
</style>
