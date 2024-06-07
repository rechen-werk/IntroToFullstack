<template>
  <div class="card" :style="{ top: 64 + start * 68 + 'px', height: duration * 68 + 'px' }">
    {{ title }}
  </div>
  <button>x</button>
</template>

<script lang="ts">
import {CalendarComponent} from "ical";

export default {
  computed: {
    CalendarComponent() {
      return CalendarComponent
    }
  },
  props: ["appointment"],
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
</style>