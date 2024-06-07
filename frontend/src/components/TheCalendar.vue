<script lang="ts">
import {decodeCredential, googleLogout} from "vue3-google-login";
import router from "@/router";
import axios from "axios";
import {inject} from "vue";
import type {VueCookies} from "vue-cookies";
import TheSearchResult from "@/components/TheSearchResult.vue";
import type {User} from "@/model/User";
import ical, {type CalendarComponent, type FullCalendar} from 'ical'

export default {
  components: {TheSearchResult},
  data: function () {
    const now = new Date()
    const current = new Date(now)
    current.setDate(now.getDate() - (now.getDay() || 7) + 1)

    const user = decodeCredential(this.$route.params.credential as string) as {
      aud: string,
      azp: string,
      email: string,
      email_verified: boolean,
      exp: number,
      given_name: string,
      iat: number,
      iss: string,
      jti: string,
      name: string,
      nbf: number,
      picture: string,
      sub: string
    };


    return {
      user: user,
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      weekdays: [
        {
          date: new Date(current),
          content: [] as CalendarComponent[]},
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        },
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        },
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        },
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        },
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        },
        {
          date: new Date(current.setDate(current.getDate() + 1)),
          content: [] as CalendarComponent[]
        }
      ],
      month: current.toLocaleString('default', {month: 'long'}),
      year: current.getUTCFullYear(),

      $cookies: inject<VueCookies>("$cookies"),

      calendarEmail: user.email,
      calendarName: user.name,
      calendarContent: {} as FullCalendar,

      searchQueryString: "",
      userList: [] as User[],
      displayUserList: [] as User[]
    }
  },
  async created() {
    axios.get(`http://localhost:3000/api/users`).then((response) => {
      this.userList.push(...response.data);
      this.displayUserList = this.userList.filter(u => this.user.email != u.email);
      const emails = response.data.map((user: any) => user.email);
      if (!emails.includes(this.user.email)) {
        axios.put(`http://localhost:3000/api/users/new/${this.user.name}/${this.user.email}`);
      }
      axios.get(`http://localhost:3000/api/calendars/ics/${this.calendarEmail}`).then((response) => {
        this.calendarContent = ical.parseICS(response.data);
      })
    });

  },
  methods: {
    toggleCalendar(days: number) {
      const isToday = function (date: Date, component: CalendarComponent): boolean {
        const start = component.start;
        const end = component.end;
        if(start && end) {
          const startIsToday =
              start.getFullYear() === date.getFullYear() &&
              start.getMonth() === date.getMonth() &&
              start.getDate() === date.getDate();
          const endIsToday =
              end.getFullYear() === date.getFullYear() &&
              end.getMonth() === date.getMonth() &&
              end.getDate() === date.getDate();
          return startIsToday && endIsToday;
        } else return false;
      }
      this.weekdays = this.weekdays.map(day => {
        day.date.setDate(day.date.getDate() + days)
        day.content = Object.values(this.calendarContent).filter(c => isToday(day.date, c));
        return day
      });
      this.month = this.weekdays[0].date.toLocaleString('default', { month: 'long' })
      this.year = this.weekdays[0].date.getUTCFullYear()
    },
    toggleCalendarLeft() {
      this.toggleCalendar(-7)
    },

    toggleCalendarRight() {
      this.toggleCalendar(7)
    },

    logout() {
      this.$cookies.remove("book-ya-mate-token")
      googleLogout();
      router.push(`/`);
    },
    view(email: string) {
      axios.get(`http://localhost:3000/api/users/${email}`).then((response) => {
        const user = response.data[0];
        this.calendarEmail = user.email;
        this.calendarName = user.name;
        axios.get(`http://localhost:3000/api/calendars/ics/${this.calendarEmail}`).then((response) => {
          this.calendarContent = ical.parseICS(response.data);
        });
      })


    },
    search() {
      const query = this.searchQueryString.toLowerCase()
      this.displayUserList = this.userList.filter(u => this.user.email != u.email && (u.name.toLowerCase().includes(query) || u.email.toLowerCase().split("@")[0].includes(query)));
    }
  }
}

</script>
<template>
  <main>
    <div class="calendar">
      <div class="calendar-container">
        <nav class="calendar-nav">
          <div class="calendar-nav-left">
            <button class="username-button" @click="view(user.email)" title="View your own calendar">{{user.name}} </button>
            <span class="viewing-span">viewing </span>
            <span class="viewed-user" v-if="calendarEmail !== user.email">{{ calendarName }}</span>
            <span class="viewed-user" v-else>myself</span>
          </div>
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
          <div class="calendar-day" v-for="(weekday, idx) in weekdays" :key="weekday.date.getDay()">
            <div class="day-header">
              {{ daysOfWeek[idx] }}
              <div class="day-number"> {{ weekdays[idx].date.getDate() }} </div>
            </div>
            <div class="day-body">
              <div class="day-hour" v-for="index in 24" :key="index">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <aside>
      <div class="sidebar-container">
        <div class="search">
          <div class="form">
            <input type="text" v-model="searchQueryString" v-on:keyup.enter="search" placeholder="Search for friends...">
            <button type="submit" value="" @click="search"><img src="/src/icons/search-line-icon.png"></button>
          </div>
          <div class="search-results">
            <TheSearchResult v-for="user in displayUserList" :user=user @setView="view"/>
          </div>
        </div>
      </div>
    </aside>
  </main>
</template>

<style scoped>
  main {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;
    overflow: hidden;
  }
  main .calendar {
    height: 100%;
    flex: 82
  }
  .calendar * {
    user-select: none;
  }

  main aside {
    height: 100%;
    flex: 18
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
  .username-button {
    background-color: transparent;
    color: #f1c40f;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .viewing-span {
    font-size: small;
  }

  .viewed-user {
    font-size: smaller;
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

  .sidebar-container {
    background-color: #efefef;
    height: 100%;
  }
  .search > .form {
    margin: 12px;
    display: flex;
    flex-direction: row;
    height: 40px;
  }
  .search > .form > input {
    flex: 9;
  }
  .search > .form > button {
    flex: 1;
    background-color: yellow;
    cursor: pointer;
  }
  .search > .form > button > img{
    width: 100%;
    padding: 15%;
  }
</style>