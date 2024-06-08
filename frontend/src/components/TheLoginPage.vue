<script lang="ts">
import {GoogleLogin} from "vue3-google-login";
import router from "@/router";
import {inject} from "vue";
import type {VueCookies} from "vue-cookies";

export default {
  components: {GoogleLogin},
  data() {
    return {
      $cookies: inject<VueCookies>("$cookies")
    }
  },
  methods: {
    login(response: any) {
      router.push(`calendar/${response.credential}`);
      this.$cookies.set("book-ya-mate-token", response.credential, "1h");
    }
  }
}


</script>
<template>
  <div class="container">
    <aside>
      <div>
        <h2>Project</h2>
        <p>Find this repository on <a href="https://github.com/rechen-werk/IntroToFullstack" target="_blank">Github</a>.</p>
      </div>
      <div>
        <h2>Contributors</h2>
        <p><a href="https://github.com/rechen-werk" target="_blank">Adrian Vinojcic</a></p>
        <p><a href="https://github.com/BioGustav" target="_blank">Tobias Pilz</a></p>
      </div>
    </aside>
    <main>
      <h1>Book Ya Mate</h1>
      <div class="login-container">
        <GoogleLogin :callback="login" auto-login prompt/>
        <div style="padding: 32px 0;">
          <p>This site would have a lot of potential, but we only provide a sign in button which logs you in via Google.</p>
          <p>If you have money, we are willing to take it, and in favor we would put some advertisement here for you.</p>
          <p>Instead here is a picture of a cat:</p>
        </div>
        <img src="https://cataas.com/cat" alt="Image of random cat." style="width: 50%">
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  user-select: none;
}
.container {
  display: flex;
  flex-direction: row;
}
aside {
  position: absolute;
  left: -180px;
  transition: 0.3s;
  padding: 15px 40px 15px 15px;
  width: 220px;
  font-size: 20px;
  background-color: #8c8c8c;
  border-radius: 0 5px 5px 0;
  height: 80%;
  margin: 5% 0;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 20px;
}
aside * {
  color: #f1c40f;
}
aside:hover {
  left: 0;
}
a {
  text-decoration: none;
  color: #f0dfff;
}
h2 {
  font-size: 24px;
}
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #eeeeee;
}
h1 {
  font-size: 60px;
  margin-bottom: 80px;
}
.login-container {
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  width: 30%;
  height: max-content;
}
.login-container h1 {
  margin-bottom: 20px;
}
</style>