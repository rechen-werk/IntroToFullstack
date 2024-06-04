<script setup lang="ts">
import {GoogleLogin, decodeCredential} from "vue3-google-login";
import router from "@/router";

function login(response: any) {
  router.push(`calendar/${response.credential}`);
}
</script>
<template>
  <div class="container">
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
  </div>
</template>

<style scoped>
.container {
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