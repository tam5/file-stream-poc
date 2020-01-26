<template>
    <transition name="fade">
        <div class="mt-16 h-64 overflow-auto w-1/3 mx-auto bg-gray-700 text-white rounded p-4" v-if="chunk.length">
            <h2 class="text-xl">File Preview - Chunk {{ index }}</h2>
            <div class="text-left mt-4">
                <p v-for="(line, i) in chunk.split('\n')" :key="i">{{ line }}</p>
            </div>
        </div>
    </transition>
</template>

<script>
 export default {
     name: 'FilePreview',

     props: [
         'index', 'chunk'
     ]
 }
</script>
