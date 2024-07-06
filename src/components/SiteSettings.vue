<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "SiteSettings",
  data() {
    return {
      backgroundColor: store.state.backgroundColor,
    };
  },
  methods: {
    onChangeBackgroundColor() {
      this.setBackGroundColor(this.backgroundColor);
    },
    setBackGroundColor(color: string) {
      this.backgroundColor = color;
      store.commit("setBackgroundColor", color);
    },
  },
  computed: {
    backgroundColorCaptionStyle() {
      //const bgColor = "#ffffff";
      return {
        //backgroundColor: bgColor,
      };
    },
  },
});
</script>

<template>
  <div class="site-settings">
    <h1>表示設定</h1>
    <h2 :style="backgroundColorCaptionStyle">入力履歴背景色</h2>

    <div style="display: flex; align-items: center; gap: 10px">
      <p>
        <strong>背景色を選択してください</strong>
      </p>
      <input
        type="color"
        v-model="backgroundColor"
        @change="onChangeBackgroundColor"
      />
    </div>

    <div style="display: flex; gap: 10px">
      <p>プリセット</p>
      <div style="display: flex; align-items: center; gap: 10px">
        <input
          type="button"
          value="White"
          class="white-bg-button"
          @click="setBackGroundColor('#ffffff')"
        />
        <input
          type="button"
          value="Green"
          class="green-bg-button"
          @click="setBackGroundColor('#00ff00')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.white-bg-button {
  background-color: #ffffff;
  color: black;
  border: 1px solid black;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.green-bg-button {
  background-color: #00ff00;
  color: black;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
