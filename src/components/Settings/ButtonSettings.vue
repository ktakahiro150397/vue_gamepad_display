<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";
import {
  KeyHistoryDisplayType,
  KeyInputHistoryDropdownItem,
} from "@/display-type";
import InputSettings from "./InputSettings.vue";
import { Device, GetServerInfo } from "@/api/get-server-info";

export default defineComponent({
  name: "ButtonSettings",
  components: {
    InputSettings,
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      devices: [] as Device[],
      presetNames: [] as string[],

      selectedPresetName: "",
      selectedGamepadId: "",
      selectedGamepadDevice: "",
    };
  },
  methods: {
    onChangeGamepadSelection() {
      this.setPresetNameList();
    },
    onChangeDeviceSelection() {
      this.setPresetNameList();
    },
    onSaveButtonSetting() {
      // ボタン設定の保存ボタン押下イベント
      this.setPresetNameList();
    },
    onDeleteButtonSetting() {
      // ボタン設定の削除ボタン押下イベント
      this.selectedPresetName = "";
      this.setPresetNameList();
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
        console.error(error);

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
  <div class="container-fluid mt-3">
    <div class="card mb-3">
      <div class="card-header">ボタン設定</div>

      <div class="card-body">
        <div class="mb-3 row">
          <p>パッド入力時に表示するボタンを設定します。</p>
        </div>

        <div class="row px-3">
          <div class="alert alert-warning" role="alert">
            <i class="bi bi-exclamation-circle-fill"></i>
            設定するゲームパッドを選択してください。
          </div>
        </div>

        <div class="mb-3 row px-3">
          <label class="form-label">ブラウザに接続されているゲームパッド</label>
          <select
            class="form-select"
            v-model="selectedGamepadId"
            @change="onChangeGamepadSelection"
          >
            <option
              v-for="gamepad in gamepads"
              :key="gamepad.id"
              :value="gamepad.id.toString()"
            >
              {{ gamepad.id }}
            </option>
          </select>
        </div>

        <div class="mb-5 row px-3">
          <label class="form-label">Windowsに接続されているゲームパッド</label>
          <select
            class="form-select"
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

        <div v-if="selectedGamepadId != '' && selectedGamepadDevice != ''">
          <hr class="mb-3" style="border-top: 5px dotted #000" />

          <div class="mb-5 row px-3">
            <label for="listPresetName" class="form-label">プリセット名</label>
            <input
              list="presetNameDataList"
              class="form-select"
              v-model="selectedPresetName"
            />
            <label class="form-text"
              >プリセット名を選択または入力してください。同じプリセット名で保存した場合は上書きされます。</label
            >
            <datalist id="presetNameDataList">
              <option v-for="presetName in presetNames" :key="presetName">
                {{ presetName }}
              </option>
            </datalist>
          </div>

          <InputSettings
            :presetName="selectedPresetName"
            :gamepadId="selectedGamepadId"
            :deviceId="selectedGamepadDevice"
            @onSaveButtonSetting="onSaveButtonSetting"
            @onDeleteButtonSetting="onDeleteButtonSetting"
          />
        </div>
      </div>
    </div>
  </div>
</template>
