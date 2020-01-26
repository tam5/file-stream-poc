<template>
    <transition name="fade">
        <div class="h-8 w-1/2 mx-auto bg-gray-300 rounded">
            <div class="progress bg-pink-300 h-full rounded" :style="`width: ${current/total * 100}%;`"></div>
            <div class="text-sm flex justify-center">{{ current }}/{{ total }} chunks - {{ current / total * 100}}%</div>
        </div>
    </transition>
</template>

<script>
 export default {
     name: 'ProgressBar',

     props: ['current', 'total']
 }
</script>

<style scoped>
 .progress {
     transition: all .75s ease;
 }
</style>
