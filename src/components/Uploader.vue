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

        <div v-if="file">
            <FileInfo :file="file" />

            <transition name="fade">
                <div class="mt-16 w-1/3 mx-auto" v-if="file">
                    <button
                        @click="upload"
                        type="button"
                        class="bg-purple-600 hover:bg-purple-800 text-white mt-12 px-6 py-2 rounded"
                    >
                        Begin Upload
                    </button>
                </div>
            </transition>

            <ProgressBar ref="progress" :total="totalBytes" :current="currentBytes" class="mt-8" />

            <div class="text-sm flex justify-center" v-if="currentChunkIndex">
                Chunks: {{ currentChunkIndex }}
            </div>
        </div>
    </div>
</template>

<script>
 import FileInfo from './FileInfo.vue'
 import ProgressBar from './ProgressBar.vue'

 export default {
     name: 'Uploader',

     components: {
         FileInfo,
         ProgressBar
     },

     data() {
         return {
             buffer: '',
             currentBytes: 0,
             currentChunk: '',
             currentChunkIndex: 0,
             file: null
         }
     },

     watch: {
         file() {
             this.currentBytes = 0
         }
     },

     computed: {
         totalBytes() {
             return this.file ? this.file.size : 0
         }
     },

     methods: {
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

             this.$refs.progress.initialize()

             this.read(this.file.stream().getReader())
         },

         read(reader) {
             reader.read().then(({ value, done }) => {
                 this.onProgress(new TextDecoder("utf-8").decode(value))
                 this.currentBytes += value ? value.length : 0

                 if (!done) {
                     this.read(reader)
                 } else {
                     console.log('finished')
                 }
             })
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
