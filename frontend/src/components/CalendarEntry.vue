<script lang="ts">
import {CalendarComponent} from "ical";

export default {
  props: ["appointment", "isOwnCalendar"],
  data() {
    const component = this.appointment as CalendarComponent
    const start = component.start.getHours() + component.start.getMinutes() / 60;
    const duration = (component.end.getHours() + component.end.getMinutes() / 60) - start;
    return {
      title: component.summary,
      start,
      duration
    }
  }
}
</script>

<template>
  <div class="card" :style="{ top: 64 + start * 68 + 'px', height: duration * 68 + 'px' }">
    <div class="title">{{ title }}</div>
    <button v-if="isOwnCalendar"><img src="/src/icons/trash-clear.png" alt="Delete appointment" title="Delete"></button>
  </div>

</template>

<style scoped>
  .card {
    padding: 8px;
    background-color: #343434;
    color: #f1c40f;
    width: 100%;
    user-select: none;
    z-index: 2;
    position: absolute;
    overflow: clip;
  }

  .card > button {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: none;
  }

  .card > button img {
    width: 100%;
    height: 100%;
    filter: invert(100%);
  }

  .card > button img:hover {
    content: url("/src/icons/trash-red.png");
    filter: invert(0%);
  }
</style>