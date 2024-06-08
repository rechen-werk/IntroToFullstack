<script lang="ts">
import axios from "axios";
import {type CalendarRequest} from "@/model/CalendarRequest";

export default {
  data() {
    return {
      email: this.$route.params.email,
      requestsForMe: null as [CalendarRequest] | null,
      requestsByMe:  null as [CalendarRequest] | null,
    }
  },
  async created() {
    axios.get(`http://localhost:3000/api/requests/for/${this.email}`).then((response) => {
      this.requestsForMe = response.data.requests as [CalendarRequest];
    });
    axios.get(`http://localhost:3000/api/requests/by/${this.email}`).then((response) => {
      this.requestsByMe = response.data.requests as [CalendarRequest];
    });
  }
}
</script>

<template>
  <main>
    <article>
      <h1>Incoming Requests</h1>
      <div class="request-list">
        <div v-for="request of requestsForMe" class="request">
          {{request}}
        </div>
      </div>
    </article>
    <article>
      <h1>Outgoing Requests</h1>
      <div class="request-list">
        <div v-for="request of requestsByMe" class="request">
          {{request}}
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
   overflow-y: auto;
 }
 h1 {
   height: 36px;
 }
 .request-list {
   background-color: #8c8c8c;
   height: calc(100% - 36px);
 }
 .request {
   background-color: white;
   margin: 8px;
 }
</style>