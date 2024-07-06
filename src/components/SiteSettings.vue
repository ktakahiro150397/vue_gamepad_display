<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";
import KeyInputPreview from "./KeyInputPreview.vue";

export default defineComponent({
  name: "SiteSettings",
  components: {
    KeyInputPreview,
  },
  data() {
    return {
      backgroundColor: store.state.backgroundColor,
      gamepads: [] as Gamepad[],
      selectedGamepadIndex: 0,
    };
  },
  methods: {
    updateGamepads() {
      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
    },
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
    selectedGamepadId(): string {
      if (this.gamepads.length === 0) {
        return "";
      }

      if (this.selectedGamepadIndex >= this.gamepads.length) {
        return "";
      }

      return this.gamepads[this.selectedGamepadIndex].id;
    },
  },
  mounted() {
    this.updateGamepads();
    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);
  },
  beforeUnmount() {
    window.removeEventListener("gamepadconnected", this.updateGamepads);
    window.removeEventListener("gamepaddisconnected", this.updateGamepads);
  },
});
</script>

<template>
  <div class="site-settings">
    <h1>表示設定</h1>

    <fieldset>
      <legend>
        <h2 :style="backgroundColorCaptionStyle">入力履歴背景色</h2>
      </legend>

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
    </fieldset>

    <fieldset>
      <legend>
        <h2>ボタン設定</h2>
      </legend>

      <div>
        <select v-model="selectedGamepadIndex">
          <option
            v-for="gamepad in gamepads"
            :key="gamepad.id"
            :value="gamepad.index"
          >
            {{ gamepad.id }}
          </option>
        </select>
      </div>

      <div>
        <KeyInputPreview :gamepadId="selectedGamepadId" />
      </div>
    </fieldset>
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
