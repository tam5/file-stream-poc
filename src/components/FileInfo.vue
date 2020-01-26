<template>
    <transition name="fade">
        <div class="mt-16 w-1/3 mx-auto" v-if="file">
            <h2 class="text-xl">File Info</h2>
            <div class="text-left mt-4">
                <p>File name: <span class="text-red-800">{{ file.name }}</span></p>
                <p>Size: <span class="text-red-800">{{ file.size.toLocaleString() }} bytes ({{  mb(file.size).toLocaleString() }} MB)</span></p>
                <p>Type: <span class="text-red-800">{{ file.type }}</span></p>
            </div>
        </div>
    </transition>
</template>

<script>
 import { mb } from '@/utils';

 export default {
     name: 'FileInfo',

     props: ['file'],

     methods: {
         mb(value) {
             return mb(value)
         }
     }
 }
</script>
