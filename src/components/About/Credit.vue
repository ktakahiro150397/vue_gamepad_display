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
    <h1 class="border-bottom">
      <i class="bi bi-person-heart me-2" style="color: #ff7fbf"></i>
      <span>クレジット</span>
    </h1>

    <div class="mb-3">
      <p>このアプリケーションの開発に寄与していただいた人たちです。</p>
    </div>

    <div class="mb-3">
      <h2>おなまえ</h2>
      <p>なんでもいい。</p>
      <div class="d-flex gap-1 align-items-center">
        <i class="bi bi-twitch"></i>
        <a :href="applicationDeveloperUrl" target="_blank">{{
          applicationDeveloperUrl
        }}</a>

        <a>http://games.kids.yahoo.co.jp/sports/013.html</a>
      </div>
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
