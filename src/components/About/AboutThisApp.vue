<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "AboutThisApp",
  computed: {
    serverUrl(): string {
      return store.state.serverUrl + "/swagger";
    },
  },
});
</script>

<template>
  <div class="row mt-4 pe-3">
    <h1 class="border-bottom">入力情報の取得について</h1>
    <p>
      このアプリはゲームパッドの入力を取得するため、常駐のサーバープログラムを使用します。<br />
      サーバープログラムはゲームパッド入力の取得のみを行います。
      <br />また、入力情報の保存は一切行っていません。
    </p>
  </div>

  <div class="row mt-4 pe-3">
    <h1 class="border-bottom">入力情報の送信について</h1>
    <p>
      サーバープログラムで取得した入力データはローカルのREST
      APIとして送信しています。<br />
      配布時点でのデフォルト設定では、入力情報の外部への送信は一切行いません。<br />
      ただし、ユーザーが設定を変更し、サーバーを外部へ公開した場合はその限りではありません。
    </p>

    <p>
      データ送信APIの定義については以下のリンクを参照してください。<br />
      (サーバープログラムの起動・入力取得サーバーURLが必要です)<br />
      <a :href="serverUrl" target="_blank">{{ serverUrl }}</a>
    </p>
  </div>
</template>
