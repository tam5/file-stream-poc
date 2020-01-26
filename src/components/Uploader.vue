<template>
    <div>
        <div class="pt-24">
            <h1 class="text-3xl">Hi, upload a file to test things out...</h1>

            <button @click="$refs.input.click()" type="button" class="bg-green-700 hover:bg-green-600 text-white mt-6 px-6 py-2 rounded">
                <span v-if="file">Click to select a new file</span>
                <span v-else>Click to begin</span>
            </button>
            <input ref="input" hidden type="file" />
        </div>

        <FileInfo :file="file" />

        <transition name="fade">
            <div class="mt-16 w-1/3 mx-auto" v-if="file">
                <p class="mt-8 mb-4">Chunk Size - {{ noChunkSize ? 0 : parseFloat(chunkSize).toLocaleString() }} MB</p>
                <input type="number" v-model="chunkSize" class="block mx-auto p-2 border border-gray-400 rounded">

                <p class="mt-8 mb-4">Delay - {{ noDelay ? 0 : parseFloat(delay).toLocaleString() }} seconds</p>
                <input type="number" v-model="delay" class="block mx-auto p-2 border border-gray-400 rounded">

                <button
                    @click="upload"
                    :disabled="noChunkSize"
                    type="button"
                    class="bg-purple-600 hover:bg-purple-800 text-white mt-12 px-6 py-2 rounded"
                    :class="{ 'opacity-50 cursor-not-allowed': noChunkSize }"
                >
                    Begin Upload (~{{ totalChunks }} chunk{{totalChunks === 1 ? '' : 's'}})
                </button>
            </div>
        </transition>

        <ProgressBar :total=totalChunks :current="currentChunkIndex" v-if="currentChunk" class="mt-8" />

        <div class="flex">
            <FilePreview :index="currentChunkIndex" :chunk="currentChunk" />
            <Monitors class="mt-16" />
        </div>
    </div>
</template>

<script>
 import { megabytesToBytes, mb, parseFile } from '@/utils';

 import FileInfo from './FileInfo.vue'
 import FilePreview from './FilePreview.vue'
 import Monitors from './Monitors.vue'
 import ProgressBar from './ProgressBar.vue'

 export default {
     name: 'Uploader',

     components: {
         FileInfo,
         FilePreview,
         Monitors,
         ProgressBar
     },

     data() {
         return {
             file: null,
             delay: 0,
             chunkSize: 10,
             currentChunkIndex: 0,
             currentChunk: '',
             buffer: ''
         }
     },

     computed: {
         noChunkSize() {
             return isNaN(parseFloat(this.chunkSize))
         },

         noDelay() {
             return isNaN(parseFloat(this.delay))
         },

         totalChunks() {
             if (!this.file) {
                 return 0
             }

             return Math.ceil(this.file.size / megabytesToBytes(this.chunkSize))
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
             parseFile(this.file, megabytesToBytes(this.chunkSize), this.onProgress, this.delay * 1000)
         },

         onProgress(chunk) {
             // Below is some extra logic because we don't just want to split
             // the data into chunks, but we will actually want to manipulate
             // the contents, line by line. So, we need to make sure we split
             // the data by line breaks, and not just number of bytes.

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
