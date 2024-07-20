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
      isUseTestInputStream: store.state.isUseTestInputStream,
      gamepads: [] as Gamepad[],
      devices: [] as Device[],
      presetNames: [] as string[],

      selectedPresetName: "",
      selectedGamepadId: "",
      selectedGamepadDevice: "",
    };
  },
  methods: {
    onChangeBackgroundColor() {
      this.setBackGroundColor(this.backgroundColor);
    },
    onChangeGamepadSelection() {
      this.setPresetNameList();
    },
    onChangeDeviceSelection() {
      this.setPresetNameList();
    },
    onChangeServerUrl() {
      this.setServerUrl(this.serverUrl);
    },
    onChangeIsUseTestInputStream() {
      this.setIsUseTestInputStream(this.isUseTestInputStream);
    },
    onSaveButtonSetting() {
      // ボタン設定の保存ボタン押下イベント
      this.setPresetNameList();
    },
    setIsUseTestInputStream(isUseTestInputStream: boolean) {
      store.commit("setIsUseTestInputStream", isUseTestInputStream);
    },
    setServerUrl(url: string) {
      this.serverUrl = url;
      store.commit("setServerUrl", url);
    },
    setBackGroundColor(color: string) {
      this.backgroundColor = color;
      store.commit("setBackgroundColor", color);
      this.$toast.success("背景色を変更しました。");
    },
    setPresetNameList() {
      // 選択されたゲームパッドに対応するプリセット名を名称の昇順で取得
      this.presetNames = store.state.buttonPictSettings
        .filter(
          (setting: any) =>
            setting.gamepadId === this.selectedGamepadId &&
            setting.device_id === this.selectedGamepadDevice
        )
        .map((setting: any) => setting.presetName)
        .sort();
    },
    async updateGamepads() {
      try {
        var data = await GetServerInfo.getDevices();
        this.devices = data.devices;
      } catch (error) {
        // デバイス一覧の取得に失敗
        console.log(error);

        this.$toast.open({
          message:
            "デバイス一覧の取得に失敗しました。サーバーが起動していること、URLが正しいことを確認してください。",
          duration: 5 * 1000,
          type: "error",
        });
      }

      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
      this.onChangeGamepadSelection();
    },
  },
  computed: {},
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
      <div>
        <input
          id="chkIsUseTestInputStream"
          type="checkbox"
          v-model="isUseTestInputStream"
          @change="onChangeIsUseTestInputStream"
        />
        <label for="chkIsUseTestInputStream"
          >テスト用の入力ストリームを表示する</label
        >
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

      <hr />

      <p>
        プリセット名を入力してください。同じプリセット名で保存した場合は上書きされます。
      </p>
      <label for="listPresetName">プリセット名</label>
      <input list="presetNameDataList" v-model="selectedPresetName" />
      <datalist id="presetNameDataList">
        <option v-for="presetName in presetNames" :key="presetName">
          {{ presetName }}
        </option>
      </datalist>

      <hr />

      <div v-if="selectedGamepadId === '' || selectedGamepadDevice === ''">
        <p>【ゲームパッドを選択してください】</p>
      </div>
      <div v-else>
        <InputSettings
          :presetName="selectedPresetName"
          :gamepadId="selectedGamepadId"
          :deviceId="selectedGamepadDevice"
          @onSaveButtonSetting="onSaveButtonSetting"
        />
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
