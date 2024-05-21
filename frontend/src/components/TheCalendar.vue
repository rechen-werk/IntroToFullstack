<script setup lang="ts">
defineProps<{
  msg: string,
}>()
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-nav">

    </div>
    <div class="calendar-body">
      <div class="calendar-day" v-for="weekday in weekdays">
        <div class="day-header">
          {{ weekday }}
        </div>
        <div class="day-body">
          <div class="day-hour" v-for="index in 24" :key="index">
            [{{index-1}}]
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<style scoped>
  .calendar-container {

  }
</style>