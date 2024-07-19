<script lang="tsx">
import { PropType, defineComponent, createApp } from "vue";
import GamepadKeyInputInfo from "@/input-info";
import KeyInputElement from "./KeyInputElement.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import { DropdownImage } from "@/button-pict-setting";
import store from "@/store";
import {
  Device,
  GetInputStreamResponse,
  GetServerInfo,
} from "@/api/get-server-info";

import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

export default defineComponent({
  name: "KeyInputHistory",
  components: {
    KeyInputElement,
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      selectedGamepadId: "",

      devices: [] as Device[],
      selectedGamepadDevice: "",

      previoutInputInfo: new GamepadKeyInputInfo(),
      inputInfo: new GamepadKeyInputInfo(),

      buttonPictSetting: new ButtonPictSetting("", ""),
      inputHistoryPropertyList: [] as any,

      dropdown_images: [] as DropdownImage[],
      direction_image: [] as DropdownImage[],

      keyInputSource: null as EventSource | null,
    };
  },
  methods: {
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

      if (this.gamepads.length > 0) {
        this.selectedGamepadId = this.gamepads[0].id;
        this.onChangeGamepadSelection();
      }
      if (this.devices.length > 0) {
        this.selectedGamepadDevice = this.devices[0].device_id;
        this.onChangeDeviceSelection();
      }
    },
    generateDomId(): string {
      const date = new Date();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

      return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
    },
    onChangeGamepadSelection() {
      // 保存済みのボタン設定を取得
      if (
        !(this.selectedGamepadId === "" && this.selectedGamepadDevice === "")
      ) {
        this.buttonPictSetting = store.getters.getButtonPictSetting(
          this.selectedGamepadId,
          this.selectedGamepadDevice
        );

        console.log(
          "Loaded buttonPictSetting. GamepadId : " +
            this.buttonPictSetting.gamepadId +
            " DeviceId : " +
            this.buttonPictSetting.device_id
        );
        console.log(this.buttonPictSetting);

        this.connectToGetInputStream();
      }
    },
    onChangeDeviceSelection() {
      this.onChangeGamepadSelection();
      console.log("onChangeDeviceSelection");
    },
    connectToGetInputStream() {
      const selectedDeviceIndex = this.devices.findIndex(
        (device) => device.device_id === this.selectedGamepadDevice
      );
      if (selectedDeviceIndex === -1) {
        return;
      }

      if (this.keyInputSource !== null) {
        // 既存の接続を閉じる
        this.keyInputSource.close();
      }

      const Url =
        store.state.serverUrl +
        "/GetInputStream?joyId=" +
        this.devices[selectedDeviceIndex].joyId;
      // フェッチ
      this.keyInputSource = new EventSource(Url);
      this.keyInputSource.addEventListener(
        "message",
        (event: any) => {
          console.log(event.data);

          // GetInputStreamResponseに変換
          const parsed = JSON.parse(event.data);
          const data = new GetInputStreamResponse(
            parsed["direction_state"],
            parsed["button_state"],
            parsed["time_stamp"],
            parsed["previous_push_frame"]
          );
          this.addInputHistoryFromStream(data);
        },
        false
      );
      console.log("Fetch url : " + Url);
    },
    addInputHistoryFromStream(data: GetInputStreamResponse) {
      console.log("addInputHistoryFromStream called.");
      console.log(data);

      // キー入力履歴を追加

      // 押下方向に応じて画像データを割り当て(テンキー方式のファイル順前提)
      var directionFileData =
        this.direction_image[data.direction_state - 1].fileData;

      // 押下されているボタンの確認
      var buttonFileDataList = [] as any;
      for (var i = 0; i < 16; i++) {
        if (data.button_state[i]) {
          // 対応するボタン画像データを取得
          for (var j = 0; j < 3; j++) {
            if (this.buttonPictSetting.settings[i].pictFileNames[j] !== "") {
              // ファイル名を取得
              const fileName =
                this.buttonPictSetting.settings[i].pictFileNames[j];

              // 実ファイルデータを取得
              const fileData = this.dropdown_images.find(
                (image) => image.fileName === fileName
              )?.fileData;

              // 配列に追加
              if (
                fileData !== undefined &&
                !buttonFileDataList.some((e: any) => e.fileName === fileName)
              ) {
                buttonFileDataList.push({
                  fileName: fileName,
                  fileData: fileData,
                });
              }
            }
          }
        }
      }
      // ファイル名でソート
      buttonFileDataList.sort((a: any, b: any) => {
        if (a.fileName < b.fileName) return -1;
        if (a.fileName > b.fileName) return 1;
        return 0;
      });
      console.log(buttonFileDataList);

      const options = {
        directionFileData: directionFileData,
        buttonFileData: buttonFileDataList.map(
          (element: any) => element.fileData
        ),
        initialFrameCount: 1,
        isFreeze: false,
        domId: this.generateDomId(),
        backgroudColor: store.state.backgroundColor,
      };

      // 既存のインスタンスのisFreezeをtrueにする
      this.inputHistoryPropertyList.forEach((element: any) => {
        element.isFreeze = true;
      });

      // 直前の入力情報にフレーム数を設定
      if (this.inputHistoryPropertyList.length > 0) {
        this.inputHistoryPropertyList[0].initialFrameCount =
          data.previous_push_frame;
      }

      // プロパティを末尾に追加
      this.inputHistoryPropertyList.unshift(options);

      // 制限数を超えている分を削除
      while (this.inputHistoryPropertyList.length > 20) {
        this.inputHistoryPropertyList.pop();
      }
    },
  },
  mounted() {
    this.updateGamepads();
    // 最初の要素を選択
    console.log(this.gamepads);

    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);

    // 保存済みのボタン設定を取得
    if (!(this.selectedGamepadId === "")) {
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.gamepads[Number(this.selectedGamepadId)].id
      );

      console.log(
        "Loaded buttonPictSetting. GamepadId : " +
          this.buttonPictSetting.gamepadId
      );
      console.log(this.buttonPictSetting);
    }

    // assets/button_promptディレクトリ内のpngファイルをインポート
    const context = require.context("@/assets/button_prompt", true, /\.png$/);

    // インポートしたファイルのファイル名をdropdown_images配列に格納
    this.dropdown_images = context.keys().map((key) => {
      const fileName = key;
      const fileData = context(key);
      return new DropdownImage(fileName, fileData);
    });

    // assets/button_promptディレクトリ内のpngファイルをインポート
    const context_direction = require.context(
      "@/assets/direction",
      true,
      /\.png$/
    );

    // インポートしたファイルのファイル名をdropdown_images配列に格納
    this.direction_image = context_direction.keys().map((key) => {
      const fileName = key;
      const fileData = context_direction(key);
      return new DropdownImage(fileName, fileData);
    });
  },
  beforeUnmount() {
    window.removeEventListener("gamepadconnected", this.updateGamepads);
    window.removeEventListener("gamepaddisconnected", this.updateGamepads);

    // EventSourceの接続を閉じる
    if (this.keyInputSource) {
      this.keyInputSource.close();
    }
  },
});
</script>

<template>
  <div class="pad-selection-container">
    <div>
      <p>ブラウザに接続されているゲームパッド</p>
      <select v-model="selectedGamepadId" @change="onChangeGamepadSelection">
        <option
          v-for="gamepad in gamepads"
          :key="gamepad.id"
          :value="gamepad.id"
        >
          {{ gamepad.id }}
        </option>
      </select>
    </div>

    <div>
      <p>Windowsに接続されているゲームパッド</p>
      <select v-model="selectedGamepadDevice" @change="onChangeDeviceSelection">
        <option
          v-for="gamepad in devices"
          :key="gamepad.device_id"
          :value="gamepad.device_id"
        >
          {{ gamepad.device_name }}
        </option>
      </select>
    </div>
  </div>

  <div id="input-history-area" style="margin-top: 20px">
    <hr class="horizontal-line" />

    <div
      v-for="inputHistoryProperty in inputHistoryPropertyList"
      :key="inputHistoryProperty.domId"
    >
      <KeyInputElement
        :directionFileData="inputHistoryProperty['directionFileData']"
        :buttonFileData="inputHistoryProperty['buttonFileData']"
        :initialFrameCount="inputHistoryProperty['initialFrameCount']"
        :isFreeze="inputHistoryProperty['isFreeze']"
        :backgroundColor="inputHistoryProperty['backgroudColor']"
        ref="keyInputElement"
      />
      <hr class="horizontal-line" />
    </div>
  </div>
</template>

<style scoped>
.pad-selection-container {
  display: flex;
  align-items: left;
  gap: 20px;
}

.horizontal-line {
  padding: 0;
  margin: 0;
}
</style>
