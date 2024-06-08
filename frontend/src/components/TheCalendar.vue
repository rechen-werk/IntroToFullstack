<script lang="ts">
import {decodeCredential, googleLogout} from "vue3-google-login";
import router from "@/router";
import axios from "axios";
import {inject} from "vue";
import type {VueCookies} from "vue-cookies";
import TheSearchResult from "@/components/TheSearchResult.vue";
import type {User} from "@/model/User";
import ical, {type CalendarComponent, type FullCalendar} from 'ical'
import CalendarEntry from "@/components/CalendarEntry.vue";

window.onclick = function(event) {
  if (!event.target.matches('.profile-picture')) {
    const dropdowns = document.getElementsByClassName("dropdown");
    let i;
    for (i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if(event.target.matches('.modal')) {
    document.getElementById("request-modal").classList.remove("show-modal");
  }
}

export default {
  components: {CalendarEntry, TheSearchResult},
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
      displayUserList: [] as User[],
      ws: null as WebSocket | null,

      // request form
      fromTime: null as Date | null,
      toTime: null as Date | null,
      title: ""
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
        this.toggleCalendar(0);
      })
      this.setupWebsocketClient()
    });
  },
  methods: {
    toggleCalendar(days: number) {
      const isToday = function (date: Date, component: CalendarComponent): boolean {
        const start = new Date(component.start);
        const end = new Date(component.end);
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
    toggleDropdown() {
      document.getElementById("user-options").classList.toggle("show");
    },
    logout() {
      this.$cookies.remove("book-ya-mate-token")
      googleLogout();
      this.ws?.close();
      router.push(`/`);
    },
    showModal() {
      document.getElementById("request-modal").classList.add("show-modal");
    },
    hideModal() {
      document.getElementById("request-modal").classList.remove("show-modal");
    },
    sendRequest() {
      axios.post("http://localhost:3000/api/requests", null,{params:
            {
              fromEmail: this.user.email,
              toEmail: this.calendarEmail,
              from: this.fromTime,
              to: this.toTime,
              title: this.title
            }
      }).then((response) => {
        console.log(response.data)
        this.from = null;
        this.to = null;
        this.title = "";
      })
      this.ws?.send(`request:${this.user.email}:${this.calendarEmail}`)
    },
    donate() {
      if(Math.random() > 0.5)
        window.location = "https://ko-fi.com/rechenwerk"
      else
        window.location = "https://ko-fi.com/biogustav";
    },
    viewRequests() {
      router.push(`/requests/${this.user.email}`);
    },
    viewUser(email: string) {
      axios.get(`http://localhost:3000/api/users/${email}`).then((response) => {
        const user = response.data[0];
        this.calendarEmail = user.email;
        this.calendarName = user.name;
        axios.get(`http://localhost:3000/api/calendars/ics/${this.calendarEmail}`).then((response) => {
          this.calendarContent = ical.parseICS(response.data);
          this.toggleCalendar(0);
        });
      })
    },
    search() {
      const query = this.searchQueryString.toLowerCase()
      this.displayUserList = this.userList.filter(u => this.user.email != u.email && (u.name.toLowerCase().includes(query) || u.email.toLowerCase().split("@")[0].includes(query)));
    },
    setupWebsocketClient() {
      try {
        const user = this.user;
        const websocket = new WebSocket(`ws://localhost:3001/`)
        this.ws = websocket

        websocket.onopen = function(event) {
          websocket.send(`open:${user.email}`)
        };

        websocket.onmessage = function(event) {
          alert(`Received new request!\n${event.data}`);
        };

        websocket.onerror = function(event) {
          alert('Error occurred while connecting to the WebSocket server');
        };

        websocket.onclose = function(event) {};
      } catch(ex) {
        alert(ex)
      }
    },
  }
}

</script>
<template>
  <main>
    <div id="request-modal" class="modal">
      <div class="modal-content" @submit.prevent="sendRequest">
        <form method="post" action="http://localhost:3000/api/requests/" >
          <label for="modal-start-time">From:</label>
          <input id="modal-start-time" type="datetime-local" v-model="fromTime"/>
          <label for="modal-end-time">To:</label>
          <input id="modal-end-time" type="datetime-local" v-model="toTime"/>
          <label for="modal-text-input">Summary</label>
          <input id="modal-text-input" type="text" :placeholder="'Your plans with' + calendarName + '...'" v-model="title"/>
          <button type="submit">Request</button>
        </form>
        <button @click="hideModal">Cancel</button>
      </div>
    </div>
    <div class="calendar">
      <div class="calendar-container">
        <nav class="calendar-nav">
          <div class="calendar-nav-left">
            <button class="username-button" @click="viewUser(user.email)" title="View your own calendar">{{user.name}} </button>
            <div class="view-div">
              <span class="viewing-span">viewing </span>
              <span class="viewed-user" v-if="calendarEmail !== user.email">{{ calendarName }}</span>
              <span class="viewed-user" v-else>myself</span>
            </div>
          </div>
          <div class="calendar-nav-center">
            <button @click="toggleCalendarLeft()"><img src="/src/icons/line-angle-left-icon.png" alt="Go to previous week." title="Previous week"></button>
            <div class="calendar-nav-date">{{ month }} {{ year }}</div>
            <button @click="toggleCalendarRight()"><img src="/src/icons/line-angle-right-icon.png" alt="Go to next week." title="Next week"></button>
          </div>
          <div class="calendar-nav-right">
            <button class="profile-picture-button" @click="toggleDropdown"><img :src="user.picture" alt="Your profile picture." class="profile-picture" style="font-size: 10px"/></button>
            <div id="user-options" class="dropdown">
              <button v-if="user.email !== calendarEmail" @click="showModal()">Request Time</button>
              <button v-else @click="showModal()">Reserve Time</button>
              <button @click="viewRequests()">View my requests</button>
              <button @click="donate()">Donate</button>
              <button @click="logout()">Log out</button>
            </div>
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
              <div class="day-hour" v-for="index in 24" :key="index" />
              <CalendarEntry v-for="appointment in weekdays[idx].content" :appointment=appointment :is-own-calendar="user.email === calendarEmail"/>
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
            <TheSearchResult v-for="user in displayUserList" :user=user @setView="viewUser"/>
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
    height: fit-content;
    width: 100%;
    background-color: black;
    color: #f1c40f;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;

    position: sticky;
    top: 0;
    z-index: 5;
    flex-grow: 1;
    justify-content: space-between;
    padding: 8px;
    font-size: 24px;
  }

  .calendar-nav-left {
    text-align: left;
  }
  .username-button {
    padding: 0;
    background-color: transparent;
    color: #f1c40f;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .view-div {
    height: 28px;
  }

  .viewing-span {
    font-size: small;
  }

  .viewed-user {
    font-size: medium;
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
    vertical-align: center;
    position: relative;
    display: inline-block;
  }

  .dropdown {
    display: none;
    position: absolute;
    right: 0;
    transform: translateY(-8px);
    background-color: #646464;
    width: 180px;
    z-index: 1;
  }

  .dropdown > button {
    padding: 8px 20px;
    border: none;
    background-color: #181818;
    color: #f1c40f;
    border-bottom: 1px solid white;
  }

  .dropdown > button:hover {
    background-color: #484848;
  }

  .show {
    display: flex;
    flex-direction: column;
  }

  .calendar-nav > .calendar-nav-center > button {
    height: 48px;
    width: 48px;
    margin: auto 0;
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
  .profile-picture-button {
    height: 48px;
    padding: 0;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }
  .profile-picture{
    height: 100%;
    margin: 0;
    border-radius: 6px;
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

    width: 100%;
    position: relative;
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

  .modal {
    display: none;
    width: 100%;
    height: 100%;
    background-color: rgba(73, 73, 73, 0.58);
    position: absolute;
    z-index: 10;

    justify-content: center;
    align-items: center;
  }
  .show-modal {
    display: flex;
  }
  .modal-content {
    width: 660px;
    height: 840px;
    background-color: white;
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
    background-color: #f1c40f;
    cursor: pointer;
  }
  .search > .form > button > img{
    width: 100%;
    padding: 15%;
  }
</style>