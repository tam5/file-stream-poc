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

        <div class="mt-16 w-1/4 mx-auto" v-if="file">
            <h2 class="text-xl">File Info</h2>
            <div class="text-left mt-4">
                <p>File name: <span class="text-red-800">{{ file.name }}</span></p>
                <p>Size: <span class="text-red-800">{{ file.size.toLocaleString() }} bytes ({{  mb(file.size).toLocaleString() }} MB)</span></p>
                <p>Type: <span class="text-red-800">{{ file.type }}</span></p>
            </div>
            <button type="button" class="bg-purple-600 hover:bg-purple-800 text-white mt-6 px-6 py-2 rounded">Begin Upload</button>
        </div>
    </div>
</template>

<script>
 import { mb } from '@/utils';

 /* function parseFile(file, callback) {
  *      console.log('got a file', file)
  *     const fileSize   = file.size;
  *     const chunkSize  = 64 * 1024; // bytes
  *     let offset     = 0;
  *
  *     const readEventHandler = (event) => {
  *         if (!event.target.error) {
  *             offset += event.target.result.length;
  *
  *             callback(event.target.result); // callback for handling read chunk
  *         } else {
  *             console.log("Read error: " + event.target.error);
  *             return;
  *         }
  *
  *         if (offset >= fileSize) {
  *             console.log("Done reading file");
  *             return;
  *         }
  *
  *         // read the next chunk
  *         chunkReaderBlock(offset, chunkSize, file);
  *     }
  *
  *     const chunkReaderBlock = (_offset, length, _file) => {
  *         const r = new FileReader();
  *         const blob = _file.slice(_offset, length + _offset);
  *         r.onload = readEventHandler;
  *         r.readAsText(blob);
  *     }
  *
  *     // now let's start the read with the first block
  *     chunkReaderBlock(offset, chunkSize, file);
  * } */

 export default {
     name: 'Uploader',

     data() {
         return {
             file: null
         }
     },

     methods: {
         mb(value) {
             return mb(value)
         },

         selectFile(file) {
             console.log('selecting file', file)
             this.file = file
         }
     },

     mounted() {
         this.$refs.input.onchange = () => this.selectFile(this.$refs.input.files[0])
     }
 }
</script>
