<script setup lang="ts">
import type {User} from "@/model/User";
defineProps<{
  user: User,
}>()
</script>

<template>
  <div class="card">
    <button class="card-button" title="View Calendar">
      <img src="/src/icons/binoculars-icon.png" alt="View Calendar">
    </button>
    <div class="card-text">
      <h1>{{ user.name }}</h1>
      <h2><a>{{ user.email }}</a></h2>
    </div>
  </div>
</template>

<style scoped>
  * {
    user-select: none;
  }
  .card {
    margin: 12px;
    padding: 12px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    display: flex;
    flex-direction: row;
    background-color: white;
  }
  .card-button {
    height: 48px;
    width: 48px;
    border-radius: 24px;
    margin-right: 24px;
    border: none;
    background-color: white;
  }
  .card-button:hover {
    cursor: pointer;
    background-color: lightgray;
  }
  .card-text > h1 {
    font-size: 16px;
    font-weight: bold;
  }
  .card-text > h2 {
    font-size: 12px;
  }
  button > img {
    width: 90%;
  }
</style>