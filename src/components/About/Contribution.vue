<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContributionApp",
  computed: {
    serverRepositoryUrl(): string {
      return "https://github.com/ktakahiro150397/vue_gamepad_server";
    },
    clientRepositoryUrl(): string {
      return "https://github.com/ktakahiro150397/vue_gamepad_display";
    },
  },
});
</script>

<template>
  <div class="row mt-4 pe-3">
    <h1 class="border-bottom">
      <i class="bi bi-github me-1"></i>
      <span>GitHub</span>
    </h1>
    <p>
      サーバー・クライアントともに、このアプリのソースコードはGitHub上で公開しています。<br />
      バグ報告・機能追加のリクエストや、プルリクエストなどのあらゆるコントリビューションを歓迎しています。<br />
    </p>

    <p>
      サーバープログラムリポジトリ<br />
      <a :href="serverRepositoryUrl" target="_blank">{{
        serverRepositoryUrl
      }}</a>
    </p>
    <p>
      クライアントプログラムリポジトリ<br />
      <a :href="clientRepositoryUrl" target="_blank">{{
        clientRepositoryUrl
      }}</a>
    </p>
  </div>
</template>
