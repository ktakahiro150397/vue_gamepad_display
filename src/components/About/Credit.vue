<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContributionApp",
  computed: {
    applicationDeveloperUrl(): string {
      return "https://github.com/ktakahiro150397";
    },
    applicationDeveloperXUrl(): string {
      return "https://x.com/ktaka0315_";
    },
  },
});
</script>

<template>
  <div class="row mt-4 pe-3">
    <h1 class="border-bottom">クレジット</h1>

    <div class="mb-3">
      <p>このアプリケーションの開発に寄与していただいた人たちです。</p>
    </div>

    <div>
      <h2>ktakahiro150397</h2>
      <p>アプリケーション開発者本人 / なんでも作るので雇ってください。</p>
      <div class="d-flex gap-1 align-items-center">
        <i class="bi bi-github"></i>
        <a :href="applicationDeveloperUrl" target="_blank">{{
          applicationDeveloperUrl
        }}</a>
      </div>
      <div class="d-flex gap-1 align-items-center">
        <i class="bi bi-twitter"></i>
        <a :href="applicationDeveloperXUrl" target="_blank">{{
          applicationDeveloperXUrl
        }}</a>
        <span>(個人へご連絡の際には、フォローリクエストをお願いします)</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  border-left: 0.3rem solid rgb(255, 200, 100);
  padding-left: 0.5rem;
}
</style>
