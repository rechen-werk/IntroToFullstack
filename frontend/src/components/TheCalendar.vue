<script lang="ts">
import {decodeCredential} from "vue3-google-login";

export default {
  data() {
    const now = new Date()
    const current = new Date(now)
    current.setDate(now.getDate() - (now.getDay() || 7) + 1)
    return {
      user: decodeCredential(this.$route.params.credential as string) as {aud: string, azp: string, email: string, email_verified: boolean, exp: number, given_name: string, iat: number, iss: string, jti: string, name: string, nbf: number, picture: string, sub: string},
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      weekdays: [
          new Date(current),
          new Date(current.setDate(current.getDate() + 1)),
          new Date(current.setDate(current.getDate() + 1)),
          new Date(current.setDate(current.getDate() + 1)),
          new Date(current.setDate(current.getDate() + 1)),
          new Date(current.setDate(current.getDate() + 1)),
          new Date(current.setDate(current.getDate() + 1))
      ],
      month: current.toLocaleString('default', { month: 'long' }),
      year: current.getUTCFullYear()
    }
  },
  methods: {
    toggleCalendarLeft() {
      this.weekdays = this.weekdays.map(day => {
        day.setDate(day.getDate() - 7)
        return day
      });
      this.month = this.weekdays[0].toLocaleString('default', { month: 'long' })
      this.year = this.weekdays[0].getUTCFullYear()
    },

    toggleCalendarRight() {
      this.weekdays = this.weekdays.map(day => {
        day.setDate(day.getDate() + 7)
        return day
      });
      this.month = this.weekdays[0].toLocaleString('default', { month: 'long' })
      this.year = this.weekdays[0].getUTCFullYear()
    },

    logout() {

    }

  }
}


</script>
<template>
  <div class="calendar-container">
    <nav class="calendar-nav">
      <div class="calendar-nav-left">{{user.name}}</div>
      <div class="calendar-nav-center">
        <button @click="toggleCalendarLeft()"><img src="/src/icons/line-angle-left-icon.png" alt="Go to previous week." title="Previous week"></button>
        <div class="calendar-nav-date">{{ month }} {{ year }}</div>
        <button @click="toggleCalendarRight()"><img src="/src/icons/line-angle-right-icon.png" alt="Go to next week." title="Next week"></button>
      </div>
      <div class="calendar-nav-right">
        <button class="logout-button" @click="logout()">Log out</button>
        <img :src="user.picture" alt="Your profile picture." class="profile-picture" style="font-size: 10px"/>
      </div>
      </nav>
    <div class="calendar-body">
      <div class="calendar-timeline">
        <div class="timeline-hour" v-for="index in 24" :key="index">
          {{ `${index - 1}`.padStart(2, '0')}}:00
        </div>
      </div>
      <div class="calendar-day" v-for="(weekday, idx) in weekdays" :key="weekday.getDay()">
        <div class="day-header">
          {{ daysOfWeek[idx] }}
          <div class="day-number"> {{ weekdays[idx].getDate() }} </div>
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
    width: 204px;
    text-align: center;
    font-weight: bold;
  }

  .calendar-nav-right {
    text-align: right;
    vertical-align: center;

    display: flex;
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
    height: 48px;
    padding: 0 28px;
    background-color: #f1c40f;
    color: black;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  .profile-picture{
    width: 48px;
    border-radius: 6px;
    margin: 0 4px;
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