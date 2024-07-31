<script lang="ts">
import SiteSettings from "./SiteSettings.vue";
import KeyInputHistory from "./KeyInputHistory.vue";
import About from "./About/About.vue";
import ButtonSettings from "./Settings/ButtonSettings.vue";

import { ipcRenderer } from 'electron';

export default {
  components: {
    SiteSettings,
    KeyInputHistory,
    About,
    ButtonSettings,
  },
  data() {
    return {
      currentTab: "KeyInputHistory",
    };
  },
  async mounted() {
    // test
    var getPath = await ipcRenderer.invoke("get-path","exe");
    console.log("path=",getPath);
  }
};
</script>

<template>
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <!-- <a class="navbar-brand" @click="currentTab = 'KeyInputHistory'"
        >キー入力表示アプリ</a
      > -->
      <!-- レスポンシブなバー -->
      <!-- <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button> -->

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" @click="currentTab = 'KeyInputHistory'"
              ><span
                :class="{ contentActive: currentTab === 'KeyInputHistory' }"
                >キー入力履歴表示</span
              ></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentTab = 'ButtonSettings'">
              <span :class="{ contentActive: currentTab === 'ButtonSettings' }"
                >ボタン設定
              </span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentTab = 'SiteSettings'">
              <span :class="{ contentActive: currentTab === 'SiteSettings' }"
                >表示設定
              </span></a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" @click="currentTab = 'About'">
              <span :class="{ contentActive: currentTab === 'About' }"
                >このアプリについて
              </span></a
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="tab-content">
    <component :is="currentTab" />
  </div>
</template>

<style scoped>
.nav-link:hover,
.navbar-brand:hover {
  cursor: pointer;
}

.nav-link .contentActive {
  font-weight: bold;
}
</style>
