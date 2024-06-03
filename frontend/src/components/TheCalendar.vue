<script setup lang="ts">
defineProps<{
  name: string,
}>()
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
function toggleCalendarLeft() {
  console.log(weekReferenceDate)
}

function toggleCalendarRight() {
  console.log(weekReferenceDate)
}

function logout() {
  console.log(weekReferenceDate)
}
let weekReferenceDate = new Date()
</script>

<template>
  <div class="calendar-container">
    <nav class="calendar-nav">
      <div class="calendar-nav-left">{{ name }}</div>
      <div class="calendar-nav-center">
        <button @click="toggleCalendarLeft()"><img src="/src/icons/line-angle-left-icon.png" alt="Go to previous week." title="Previous week"></button>
        <div class="calendar-nav-date">June 2024</div>
        <button @click="toggleCalendarRight()"><img src="/src/icons/line-angle-right-icon.png" alt="Go to next week." title="Next week"></button>
      </div>
      <div class="calendar-nav-right">
        <button class="logout-button" @click="logout()">Log out</button>
      </div>
      </nav>
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
  * {
    user-select: none;
  }
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
    color: #f1c40f;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

    position: sticky;
    top: 0;
    z-index: 1000;
    flex-grow: 1;
    justify-content: space-between;
    padding: 8px;
    font-size: 24px;
  }

  .calendar-nav-left {
    text-align: left;
  }

  .calendar-nav-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .calendar-nav-date {
    width: 164px;
    text-align: center;
    font-weight: bold;
  }

  .calendar-nav-right {
    text-align: right;
  }
  .calendar-nav > .calendar-nav-center > button {
    height: 48px;
    width: 48px;
    background: none;
    border: none;
  }
  .calendar-nav > .calendar-nav-center > button > img:hover {
    filter: invert(100%)
  }
  .calendar-nav > .calendar-nav-center > button > img {
    height: 100%;
    width: 100%;
    filter: invert(80%);
  }
  .logout-button {
    padding: 10px 20px;
    background-color: #f1c40f;
    color: black;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .logout-button:hover {
    background-color: #f39c12;
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