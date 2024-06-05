<script setup lang="ts">
import axios from "axios";
import TheSearchResult from "@/components/TheSearchResult.vue";
import type {User} from "@/model/User";
import { ref } from "vue";

var myUserList: User[] = ref();
// [
//   {id: "1234", name: "Hans", email: "hans@gmail.com", active: true}, 
//   {id: "1234", name: "Hans", email: "hans@gmail.com", active: true}, 
//   {id: "1234", name: "Hans", email: "hans@gmail.com", active: true}, 
//   {id: "1234", name: "Hans", email: "hans@gmail.com", active: true}, 
//   {id: "1234", name: "Hans", email: "hans@gmail.com", active: true}
// ];

axios.get(`http://localhost:3000/api/users`).then((response) => {
  myUserList.value = response.data;
});
</script>

<template>
  <div class="sidebar-container">
    <div class="search">
      <form>
        <input type="text" placeholder="Search for friends...">
        <button type="submit" value=""><img src="/src/icons/search-line-icon.png"></img></button>
      </form>
      <div class="search-results">
        <TheSearchResult v-for="user in myUserList" :user=user />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  background-color: #efefef;
  height: 100%;
}
  .search > form {
    margin: 12px;
    display: flex;
    flex-direction: row;
    height: 40px;
  }
  .search > form > input {
    flex: 9;
  }
  .search > form > button {
    flex: 1;
    background-color: yellow;
  }
  .search > form > button > img{
    width: 100%;
    padding: 15%;
  }
</style>