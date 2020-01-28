<template>
    <transition name="fade">
        <div>
            <div class="h-8 w-1/2 mx-auto bg-gray-300 rounded">
                <div class="progress bg-pink-300 h-full rounded" :style="`width: ${percent}%;`"></div>
            </div>

            <div class="text-sm flex justify-center">{{ summary }} - {{ percent }}%</div>
            <div class="text-sm flex justify-center">
                Time Elapsed: ~{{ elapsedSeconds }} seconds
            </div>
            <div class="text-sm flex justify-center">
                Time Remaining: ~{{ remaining }}
            </div>
            <div class="text-sm flex justify-center">
                Average Chunk Time: {{ averageChunkTime.toFixed(2) }} seconds
            </div>
        </div>
    </transition>
</template>

<script>
 import { mb, toHHMMSS } from '@/utils';

 export default {
     name: 'ProgressBar',

     props: ['current', 'total'],

     data() {
         return {
             previousTimestamp: Date.now(),
             durations: [0],
             elapsedSeconds: 0,
             interval: null
         }
     },

     computed: {
         summary() {
             return `${mb(this.current).toLocaleString()} MB / ${mb(this.total).toLocaleString()} MB`
         },

         isDone() {
             return this.current === this.total
         },

         percent() {
             return parseFloat(
                 ((this.current / this.total) * 100).toFixed(2)
             )
         },

         averageChunkTime() {
             const sum = this.durations.reduce((a, b) => a + b, 0)
             return (sum / this.durations.length) || 0;
         },

         remaining() {
             return toHHMMSS(this.averageChunkTime * (this.total - this.current))
         }
     },

     watch: {
         current() {
             const now = Date.now()
             const duration = (now - this.previousTimestamp) / 1000

             this.$set(this.durations, this.durations.length, duration)

             this.previousTimestamp = now
         },

         total() {
             this.reset()
         }
     },

     methods: {
         reset() {
             this.durations = []
             this.elapsedSeconds = 0
             this.previousTimestamp = Date.now()
         },

         initialize() {
             this.reset()

             this.interval = setInterval(() => {
                 this.elapsedSeconds++;

                 if (this.isDone) {
                     clearInterval(this.interval)
                 }
             }, 1000)
         }
     }
 }
</script>

<style scoped>
 .progress {
     transition: all .75s ease;
 }
</style>
