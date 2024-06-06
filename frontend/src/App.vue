<script lang="ts">
import {inject} from "vue";
import type {VueCookies} from "vue-cookies";
import router from "@/router";

export default {
  data() {
    return {
      $cookies: inject<VueCookies>("$cookies")
    }
  },
  created() {
    const token = this.$cookies.get("book-ya-mate-token");
    if(token) {
      router.push(`calendar/${token}`);
    }
  }
}
</script>

<template>
  <RouterView />
</template>

