<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";
import InputSettings from "./Settings/InputSettings.vue";
import {
  Device,
  GetDevicesResponse,
  GetServerInfo,
} from "@/api/get-server-info";

export default defineComponent({
  name: "SiteSettings",
  components: {
    InputSettings,
    // KeyInputPreview,
  },
  data() {
    return {
      backgroundColor: store.state.backgroundColor,
      serverUrl: store.state.serverUrl,
      gamepads: [] as Gamepad[],
      devices: [] as Device[],
      selectedGamepadId: "",
      selectedGamepadDevice: "",
    };
  },
  methods: {
    onChangeBackgroundColor() {
      this.setBackGroundColor(this.backgroundColor);
    },
    onChangeGamepadSelection() {
      console.log("onChangeGamepadSelection");
    },
    onChangeDeviceSelection() {
      console.log("onChangeDeviceSelection");
    },
    onChangeServerUrl() {
      this.setServerUrl(this.serverUrl);
    },
    setServerUrl(url: string) {
      this.serverUrl = url;
      store.commit("setServerUrl", url);
    },
    setBackGroundColor(color: string) {
      this.backgroundColor = color;
      store.commit("setBackgroundColor", color);
    },
    async updateGamepads() {
      var data = await GetServerInfo.getDevices();

      this.devices = data.devices;

      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
      this.onChangeGamepadSelection();
    },
  },
  computed: {
    // currentSelectedGamepadId(): string {
    //   if (this.gamepads.length === 0) {
    //     return "";
    //   }
    //   if (this.selectedGamepadIndex >= this.gamepads.length) {
    //     return "";
    //   }
    //   return this.gamepads[this.selectedGamepadIndex].id;
    // },
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
        <h2>入力取得サーバーURL</h2>
      </legend>

      <div>
        <p><strong>サーバーURL(http://localhost:5000 など)</strong></p>
        <input
          type="text"
          v-model="serverUrl"
          @change="onChangeServerUrl"
          placeholder="http://localhost:5000"
        />
      </div>
    </fieldset>

    <fieldset>
      <legend>
        <h2>入力履歴背景色</h2>
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
        <p>ブラウザに接続されているゲームパッド</p>
        <select v-model="selectedGamepadId" @change="onChangeGamepadSelection">
          <option
            v-for="gamepad in gamepads"
            :key="gamepad.id"
            :value="gamepad.id.toString()"
          >
            {{ gamepad.id }}
          </option>
        </select>
      </div>

      <p>Windowsに接続されているゲームパッド</p>
      <div>
        <select
          v-model="selectedGamepadDevice"
          @change="onChangeDeviceSelection"
        >
          <option
            v-for="gamepad in devices"
            :key="gamepad.device_id"
            :value="gamepad.device_id"
          >
            {{ gamepad.device_name }}
          </option>
        </select>
      </div>

      <div>
        <InputSettings
          :gamepadId="selectedGamepadId"
          :deviceId="selectedGamepadDevice"
        />
        <!-- <KeyInputPreview :gamepadId="selectedGamepadId" /> -->
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
