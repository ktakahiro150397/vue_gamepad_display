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

      presetNames: [] as string[],
      selectedPresetName: "",

      previoutInputInfo: new GamepadKeyInputInfo(),
      inputInfo: new GamepadKeyInputInfo(),

      buttonPictSetting: new ButtonPictSetting("", "", ""),
      inputHistoryPropertyList: [] as any,

      dropdown_images: [] as DropdownImage[],
      direction_image: [] as DropdownImage[],

      isDisplayHorizontal: store.state.isDisplayHorizontal,
      displayHistoryCount: store.state.displayHistoryCount,

      keyInputSource: null as EventSource | null,
    };
  },
  methods: {
    async updateGamepads() {
      if (store.state.isUseTestInputStream) {
        this.$toast.info(
          "テスト用のランダムな入力情報を表示しています。この設定は「表示設定」から変更できます。"
        );
        this.connectToGetInputStreamTest();
      } else {
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
        if (this.presetNames.length > 0) {
          this.selectedPresetName = this.presetNames[0];
          this.onChangePresetSelection();
        }
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
      this.setPresetNameList();

      // 保存済みのボタン設定を取得
      if (
        !(this.selectedGamepadId === "" && this.selectedGamepadDevice === "")
      ) {
        this.buttonPictSetting = store.getters.getButtonPictSetting(
          this.selectedPresetName,
          this.selectedGamepadId,
          this.selectedGamepadDevice
        );
        this.connectToGetInputStream();
      }
    },
    onChangeDeviceSelection() {
      this.onChangeGamepadSelection();
    },
    onChangePresetSelection() {
      this.onChangeGamepadSelection();
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
    connectToGetInputStreamTest() {
      const Url =
        store.state.serverUrl +
        "/GetInputStreamTest?intervalTick=" +
        store.state.testInputStreamFrameCount;

      // フェッチ
      this.keyInputSource = new EventSource(Url);
      this.keyInputSource.addEventListener("error", (event: any) => {
        console.error(event);
        this.$toast.error(
          "入力情報の取得に失敗しました。サーバーが起動していること、URLが正しいことを確認してください。"
        );
      });
      this.keyInputSource.addEventListener(
        "message",
        (event: any) => {
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
      this.keyInputSource.addEventListener("error", (event: any) => {
        this.$toast.error(
          "入力情報の取得に失敗しました。サーバーが起動していること、URLが正しいことを確認してください。"
        );
      });
      this.keyInputSource.addEventListener(
        "message",
        (event: any) => {
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
      while (this.inputHistoryPropertyList.length > this.displayHistoryCount) {
        this.inputHistoryPropertyList.pop();
      }
    },
  },
  computed: {
    backgroundColor() {
      return store.state.backgroundColor;
    },
    borderStyle() {
      return {
        "border-bottom": "1px solid lightgray",
        "border-image": `linear-gradient(to right, lightgray, ${store.state.backgroundColor} 35%, ${store.state.backgroundColor} 100%)`,
        "border-image-slice": 1,
      };
    },
  },
  mounted() {
    this.updateGamepads();
    // 最初の要素を選択
    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);

    // 保存済みのボタン設定を取得
    if (!(this.selectedGamepadId === "")) {
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.selectedPresetName,
        this.selectedGamepadId,
        this.selectedGamepadDevice
      );

      this.setPresetNameList();
    } else if (store.state.isUseTestInputStream) {
      // テスト用のボタン設定を取得
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        "StreamingTest",
        "",
        ""
      );

      this.setPresetNameList();
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
  <div class="container-fluid">
    <div class="row mt-2">
      <div class="col">
        <div>
          <label class="form-label">ブラウザに接続されているゲームパッド</label>
          <select
            class="form-select"
            v-model="selectedGamepadId"
            @change="onChangeGamepadSelection"
          >
            <option
              v-for="gamepad in gamepads"
              :key="gamepad.id"
              :value="gamepad.id"
            >
              {{ gamepad.id }}
            </option>
          </select>
        </div>
      </div>

      <div class="col">
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

      <div class="col">
        <label class="form-label">プリセット名</label>
        <p for="listPresetName">
          <select
            class="form-select"
            v-model="selectedPresetName"
            @change="onChangePresetSelection"
          >
            <option v-for="presetName in presetNames" :key="presetName">
              {{ presetName }}
            </option>
          </select>
        </p>
      </div>
    </div>

    <div
      id="input-history-area"
      class="input-history-area"
      :style="{ backgroundColor: backgroundColor }"
    >
      <hr class="horizontal-line" />

      <!-- 横並び -->

      <div v-if="isDisplayHorizontal" class="d-flex align-items-end gap-2 ms-3">
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
        </div>
      </div>

      <!-- 縦並び -->
      <div v-else>
        <div
          :style="borderStyle"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.horizontal-line {
  padding: 0;
  margin: 0;
}

.input-history-area {
  height: 90vh;
  background-color: rgb(16, 13, 8);
}
</style>
