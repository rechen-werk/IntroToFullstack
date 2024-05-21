<script setup lang="ts">
defineProps<{
  name: string,
}>()
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
</script>

<template>
  <div class="calendar-container">
    <div class="calendar-nav">
      <div>{{ name }}</div>
    </div>
    <div class="calendar-body">
      <div class="calendar-timeline">
        <div class="timeline-hour" v-for="index in 24" :key="index">
          {{ `${index - 1}`.padStart(2, '0')}}:00
        </div>
      </div>
      <div class="calendar-day" v-for="weekday in weekdays" :key="weekday">
        <div class="day-header">
          {{ weekday }}
          <div class="day-number"> 09 </div>
        </div>
        <div class="day-body">
          <div class="day-hour" v-for="index in 24" :key="index">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
  .calendar-container {
    flex: 1;
    display: inline-block;
    height: 100%;
    overflow-y: auto;
    width: 100%;
  }
  .calendar-nav {
    height: 64px;
    width: 100%;
    background-color: black;
    color: yellow;
    display: flex;
    flex-direction: row;

    position: sticky;
    top: 0;
    z-index: 1000;
    flex-grow: 1;
  }
  .calendar-body {
    block-size: fit-content;
    display: flex;
    height: calc(100% - 64px);
    width: 100%;
    flex-direction: row;
  }
  .calendar-day {
    height: fit-content;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .day-header {
    text-align: center;
    height: 64px;
    font-size: 18px;
  }
  .day-number {
    margin: auto;
    height: 32px;
    width: 64px;
    border-radius: 16px;
    text-align: center;
    background-color: #e3e3e3;
  }
  .calendar-day:last-child > .day-body{
    border-right: 0.3px solid #969696;
  }
  .day-body {
    border-left: 0.3px solid #969696;
  }
  .day-body:last-child {
    border-bottom: 0.3px solid #969696;
  }
  .day-hour {
    width: 100%;
    height: 68px;
    border-top: 0.3px solid #969696;
    background-color: #e8e8e8;

  }
  .calendar-timeline {
    transform: translateY(64px);
    width: 52px;
  }
  .timeline-hour {
    height: 68px;
    width: 100%;
    text-align: end;
    margin-right: 8px;
  }
</style>