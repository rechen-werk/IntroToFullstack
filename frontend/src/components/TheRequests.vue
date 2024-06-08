<script lang="ts">
import axios from "axios";
import {type CalendarRequest, Status} from "@/model/CalendarRequest";

export default {
    data() {
    return {
      email: this.$route.params.email,
      requestsForMe: null as [CalendarRequest] | null,
      requestsByMe:  null as [CalendarRequest] | null,
    }
  },
  async created() {
    this.refreshRequestsByMe();
    this.refreshRequestsForMe();
  },
  methods: {
    formatDate(startDate: Date, endDate: Date): string {
      const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      function getOrdinalSuffix(day: number): string {
        if (day > 3 && day < 21) return 'th'
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      }

      function padZero(value: number): string {
        return value.toString().padStart(2, '0');
      }

      const startMonth = months[startDate.getMonth()];
      const startDay = startDate.getDate();
      const startYear = startDate.getFullYear();
      const startHour = padZero(startDate.getHours());
      const startMinute = padZero(startDate.getMinutes());

      const endHour = padZero(endDate.getHours());
      const endMinute = padZero(endDate.getMinutes());

      const ordinalSuffix = getOrdinalSuffix(startDay);

      return `${startMonth} ${startDay}${ordinalSuffix} ${startYear}, ${startHour}:${startMinute} - ${endHour}:${endMinute}`;
    },
    accept(request: CalendarRequest) {
      axios.post(`http://localhost:3000/api/requests/accept/${request.id}`).then((response) => {
        this.refreshRequestsForMe()
      })
    },
    deny(request: CalendarRequest) {
      axios.post(`http://localhost:3000/api/requests/deny/${request.id}`).then((response) => {
        this.refreshRequestsForMe()
      })
    },
    cancel(request: CalendarRequest) {
      axios.delete(`http://localhost:3000/api/requests/${request.id}`).then((response) => {
        this.refreshRequestsByMe()
      })
    },
    refreshRequestsForMe() {
      axios.get(`http://localhost:3000/api/requests/for/${this.email}`).then((response) => {
        this.requestsForMe = (response.data.requests as [CalendarRequest]).filter((request) => request.status === Status.open);
      });
    },
    refreshRequestsByMe() {
      axios.get(`http://localhost:3000/api/requests/by/${this.email}`).then((response) => {
        this.requestsByMe = (response.data.requests as [CalendarRequest]).filter((request) => request.status === Status.open);
      });
    }
  }
}
</script>

<template>
  <main>
    <article>
      <h1>Incoming Requests</h1>
      <div class="request-list">
        <div v-for="request of requestsForMe" class="request">
          <div class="info">
            <div>From: {{request.fromEmail}}</div>
            <div>{{formatDate(new Date(request.start), new Date(request.end))}}</div>
            <div>Title: {{request.title}}</div>
          </div>
          <div class="buttons">
            <button class="accept-button" @click="accept(request)">ACCEPT</button>
            <button class="deny-button" @click="deny(request)">DENY</button>
          </div>
        </div>
      </div>
    </article>
    <article>
      <h1>Outgoing Requests</h1>
      <div class="request-list">
        <div v-for="request of requestsByMe" class="request">
          <div class="info">
            <div>To: {{request.toEmail}}</div>
            <div>{{formatDate(new Date(request.start), new Date(request.end))}}</div>
            <div>Title: {{request.title}}</div>
          </div>
          <div class="buttons">
            <button class="cancel-button" @click="cancel(request)">CANCEL</button>
          </div>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
 main {
   display: flex;
   flex-direction: row;
   justify-content: center;
   padding: 7.5% 0;
   width: 100%;
   height: 100vh;
   background-color: #c2c2c2;
   gap: 40px;
 }
 article {
   width: 30%;
   height: 100%;
 }
 h1 {
   height: 36px;
 }
 .request-list {
   background-color: #8c8c8c;
   height: calc(100% - 36px);
   overflow-y: auto;
   box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
 }
 .request {
   background-color: #000000;
   margin: 8px;
   color: #f1c40f;
   padding: 6px;
   box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
   display: flex;
   justify-content: space-between;
 }
 button {
   cursor: pointer;
 }
 .buttons {
   bottom: 0;
   right: 0;
   display: flex;
   justify-content: end;
   flex-direction: column;
   gap: 8px;
 }
 .accept-button {
   background-color: #5eb05e;
   border: none;
   height: 24px;
   width: 74px;
 }
 .deny-button {
   background-color: #ef6e6e;
   border: none;
   height: 24px;
   width: 74px;
 }
 .cancel-button {
   background-color: #cc7933;
   border: none;
   height: 24px;
   width: 74px;
 }
</style>