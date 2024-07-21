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
      isDisplayFrameCount: store.state.isDisplayFrameCount,
      isDisplayHorizontal: store.state.isDisplayHorizontal,
      displayHistoryCount: store.state.displayHistoryCount,

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
    onChangeIsDisplayFrameCount() {
      this.setIsDisplayFrameCount(this.isDisplayFrameCount);
    },
    onChangeIsDisplayHorizontal() {
      this.setIsDisplayHorizontal(this.isDisplayHorizontal);
    },
    onSaveButtonSetting() {
      // ボタン設定の保存ボタン押下イベント
      this.setPresetNameList();
    },
    onChangeDisplayHistoryCount() {
      store.commit("setDisplayHistoryCount", this.displayHistoryCount);
    },
    onDeleteButtonSetting() {
      // ボタン設定の削除ボタン押下イベント
      this.selectedPresetName = "";
      this.setPresetNameList();
    },
    setIsUseTestInputStream(isUseTestInputStream: boolean) {
      store.commit("setIsUseTestInputStream", isUseTestInputStream);
    },
    setIsDisplayFrameCount(isDisplayFrameCount: boolean) {
      store.commit("setIsDisplayFrameCount", isDisplayFrameCount);
    },
    setIsDisplayHorizontal(isDisplayHorizontal: boolean) {
      store.commit("setIsDisplayHorizontal", isDisplayHorizontal);
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
  <div class="container-fluid mt-3">
    <div class="card mb-4">
      <div class="card-header">サーバー設定</div>
      <div class="card-body">
        <div class="mb-3 row">
          <div class="col">
            <label class="form-label">入力取得サーバーURL</label>

            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  v-model="serverUrl"
                  @change="onChangeServerUrl"
                  placeholder="http://localhost:5000"
                />
                <span class="form-text">
                  入力取得を行うサーバーのURLを入力してください。デフォルトは「http://localhost:5000」です。
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form-switch">
              <input
                id="chkIsUseTestInputStream"
                type="checkbox"
                class="form-check-input"
                v-model="isUseTestInputStream"
                @change="onChangeIsUseTestInputStream"
              />
              <label for="chkIsUseTestInputStream" class="form-check-label ms-2"
                >テスト用の入力ストリームを表示する</label
              >
            </div>
            <span class="form-text">
              実際の入力ではなく、ランダムな入力をサーバーから取得して表示します。(動作確認向け)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">表示設定</div>
      <div class="card-body">
        <div class="mb-3 row">
          <div class="col">
            <label class="form-label">入力履歴背景色</label>
            <input
              type="color"
              class="form-control form-control-color"
              v-model="backgroundColor"
              @change="onChangeBackgroundColor"
            />
          </div>
        </div>

        <div class="mb-4 row">
          <div class="col">
            <label class="form-label col-12">背景色プリセット</label>
            <button
              type="button"
              class="btn btn-color-preset me-2"
              style="color: black"
              @click="setBackGroundColor('#ffffff')"
            >
              Whilte(#FFFFFF)
            </button>
            <button
              type="button"
              class="btn btn-color-preset me-2"
              style="background-color: #00ff00"
              @click="setBackGroundColor('#00ff00')"
            >
              Green(#00FF00)
            </button>
            <button
              type="button"
              class="btn btn-color-preset"
              style="background-color: #552200; color: white"
              @click="setBackGroundColor('#552200')"
            >
              Brown(#552200)
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form-switch">
              <input
                type="checkbox"
                id="chkIsDisplayFrameCount"
                class="form-check-input"
                v-model="isDisplayFrameCount"
                @change="onChangeIsDisplayFrameCount"
              />
              <label for="chkIsDisplayFrameCount" class="form-check-label ms-2">
                入力フレーム数を表示する
              </label>
            </div>
          </div>
        </div>

        <div class="mb-3 row">
          <div class="col">
            <div class="form-switch">
              <input
                type="checkbox"
                id="chkIsDisplayHorizontal"
                class="form-check-input"
                v-model="isDisplayHorizontal"
                @change="onChangeIsDisplayHorizontal"
              />
              <label for="chkIsDisplayHorizontal" class="form-check-label ms-2">
                キー入力を横並びに表示する
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label class="form-label">表示キー履歴数</label>

            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  v-model="displayHistoryCount"
                  @change="onChangeDisplayHistoryCount"
                  placeholder="20"
                />
                <span class="form-text">
                  入力履歴を表示する最大数を入力してください。デフォルトは「20」です。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
          <hr class="mb-5" style="border-top: 5px dotted #000" />

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

<style scoped>
.btn-color-preset {
  border: 1px solid black;
}

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
