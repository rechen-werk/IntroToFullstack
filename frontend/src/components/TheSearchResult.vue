<script setup lang="ts">
import type {User} from "@/model/User";
const props = defineProps<{
  user: User,
}>()
const emit = defineEmits(['setView'])
function view() {
  emit('setView', props.user.email);
}
</script>

<template>
  <div class="card">
    <button class="card-button" title="View Calendar" @click="view">
      <img src="/src/icons/binoculars-icon.png" alt="View Calendar of {{user.name}}">
    </button>
    <div class="card-text">
      <h1 title="Write an email"><a :href="`mailto:${user.email}`">{{ user.name }}</a></h1>
    </div>
  </div>
</template>

<style scoped>
  * {
    user-select: none;
  }
  .card {
    margin: 12px;
    padding: 8px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    display: flex;
    flex-direction: row;
    background-color: white;
  }
  .card-button {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    margin-right: 20px;
    border: none;
    background-color: white;
  }
  .card-button:hover {
    cursor: pointer;
    background-color: lightgray;
  }
  .card-text {
    margin: auto 0;
  }
  .card-text > h1, .card-text > h1 > a {
    font-size: 16px;
    font-weight: bold;
    color: black;
    text-decoration: none;
  }
  .card-text > h2 {
    font-size: 12px;
  }
  button > img {
    width: 90%;
  }
</style>