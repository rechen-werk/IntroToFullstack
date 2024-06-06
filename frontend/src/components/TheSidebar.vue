<script lang="ts">
import axios from "axios";
import TheSearchResult from "@/components/TheSearchResult.vue";
import type {User} from "@/model/User";
import {decodeCredential} from "vue3-google-login";

export default {
  components: {TheSearchResult},
  data() {
    return {
      searchQueryString: "",
      userList: [] as User[],
      displayUserList: [] as User[],
      user: decodeCredential(this.$route.params.credential as string) as {aud: string, azp: string, email: string, email_verified: boolean, exp: number, given_name: string, iat: number, iss: string, jti: string, name: string, nbf: number, picture: string, sub: string},

    }
  },
  methods: {
    search() {
      this.displayUserList = this.userList.filter(u => this.user.email != u.email && u.name.toLowerCase().includes(this.searchQueryString.toLowerCase()));
    }
  },
  async created() {
    axios.get(`http://localhost:3000/api/users`).then((response) => {
      this.userList.push(...response.data);
      this.displayUserList = this.userList.filter(u => this.user.email != u.email);
    });
  }
}
</script>

<template>
  <div class="sidebar-container">
    <div class="search">
      <div class="form">
        <input type="text" v-model="searchQueryString" placeholder="Search for friends...">
        <button type="submit" value="" @click="search"><img src="/src/icons/search-line-icon.png"></button>
      </div>
      <div class="search-results">
        <TheSearchResult v-for="user in displayUserList" :user=user />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  }
  .search > .form > button > img{
    width: 100%;
    padding: 15%;
  }
</style>