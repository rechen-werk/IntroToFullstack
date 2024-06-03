<script setup lang="ts">
import TheSidebar from "@/components/TheSidebar.vue";
import TheCalendar from "@/components/TheCalendar.vue";
import TheLoginPage from "@/components/TheLoginPage.vue";
</script>

<template>
  <header>
  </header>
  <main>
    <!--div class="calendar">
      <TheCalendar name="Adrian Vinojcic"/>
    </div>
    <div class="sidebar">
      <TheSidebar/>
    </div-->
    <TheLoginPage/>
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

  main .sidebar {
    height: 100%;
    flex: 18
  }
</style>
