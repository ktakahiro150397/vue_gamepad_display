<script lang="ts">
import SiteSettings from "./SiteSettings.vue";
import KeyInputHistory from "./KeyInputHistory.vue";

export default {
  components: {
    SiteSettings,
    KeyInputHistory,
  },
  data() {
    return {
      currentTab: "KeyInputHistory",
    };
  },
};
</script>

<template>
  <ul class="tabs-menu">
    <li
      @click="currentTab = 'KeyInputHistory'"
      :class="{ active: currentTab === 'KeyInputHistory' }"
    >
      キー入力履歴表示
    </li>
    <li
      @click="currentTab = 'SiteSettings'"
      :class="{ active: currentTab === 'SiteSettings' }"
    >
      表示設定
    </li>
  </ul>
  <div class="tab-content">
    <component :is="currentTab" />
  </div>

  <!-- <div style="width: 500px">
    <SiteSettings />
  </div> -->
</template>

<style scoped>
.tabs-menu {
  margin: 0;
  padding: 0;
  list-style-type: none;

  display: flex;
}

/* タブの基本スタイル */
.tabs-menu li {
  display: block;
  width: fit-content;

  margin-right: 8px;
  margin-bottom: -1px;
  padding: 10px 20px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
  border-radius: 4px 4px 0 0;
  color: #557f95;
  text-decoration: none;
}

/* タブにマウスを乗せたらカーソルの形を変える */
.tabs-menu li:hover {
  cursor: pointer;
}

/* 非選択のタブにマウスを乗せたら色を変える */
.tabs-menu li:not(.active):hover {
  border-color: #f0f0f0 #f0f0f0 #999;
  background-color: #f0f0f0;
}

/* 選択中のタブ */
.tabs-menu .active {
  border-color: #999 #999 transparent #999;
  background-color: #f0fbff;
  color: black;
}

/* タブコンテンツ表示エリア */
.tabs-content {
  /* clear: both; */
  background-color: orange;
  border: 1px solid #999;
  border-radius: 0 4px 4px 4px;
  padding: 10px 10px 30px 10px;
}
</style>
