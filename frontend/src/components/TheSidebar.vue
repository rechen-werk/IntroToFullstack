<script lang="ts">
import axios from "axios";
import TheSearchResult from "@/components/TheSearchResult.vue";
import type {User} from "@/model/User";

export default {
  components: {TheSearchResult},
  data() {
    return {
      userList: [] as User[]
    }
  },
  async created() {
    axios.get(`http://localhost:3000/api/users`).then((response) => {
      this.userList.push(...response.data);
    });
  }
}
</script>

<template>
  <div class="sidebar-container">
    <div class="search">
      <form>
        <input type="text" placeholder="Search for friends...">
        <button type="submit" value=""><img src="/src/icons/search-line-icon.png"></button>
      </form>
      <div class="search-results">
        <TheSearchResult v-for="user in userList" :user=user />
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