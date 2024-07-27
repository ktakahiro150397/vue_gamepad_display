<script lang="tsx">
import { PropType, defineComponent, createApp, ref } from "vue";
import GamepadKeyInputInfo from "@/input-info";
import KeyInputElement from "./KeyInputElement.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import { DropdownImage } from "@/button-pict-setting";
import store from "@/store";
import { KeyHistoryDisplayType } from "@/display-type";
import { DisplayButtonHandler } from "@/display-button-handler";
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
      latestInputHistoryProperty: {
        directionFileData: "",
        buttonFileData: [],
        initialFrameCount: 1,
        isFreeze: false,
        triggerFrameReset: false,
      },
      inputHistoryPropertyList: [] as any,

      dropdown_images: [] as DropdownImage[],
      direction_image: [] as DropdownImage[],

      displayHistoryCount: store.state.displayHistoryCount,
      inputHistoryDisplayType: store.state
        .inputHistoryDisplayType as KeyHistoryDisplayType,

      keyInputSource: null as EventSource | null,
      inputStreamHandler: {} as DisplayButtonHandler,
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

        // キー入力ハンドラを初期化
        this.inputStreamHandler = new DisplayButtonHandler(
          this.inputHistoryDisplayType,
          this.buttonPictSetting,
          this.direction_image,
          this.dropdown_images
        );
      }
    },
    // GUIDを生成する関数
    generateGUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
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

      // 最新入力情報をハンドラ経由で取得
      const latestInput = this.inputStreamHandler.getAddProperty(data);
      if (latestInput.length === 0) {
        // キー入力プロパティを取得しなかった場合、なにもしない
        return;
      }

      // フレーム状態をリセットするため、プロパティを明示的に変更
      latestInput.forEach((element: any) => {
        element.triggerFrameReset =
          !this.latestInputHistoryProperty.triggerFrameReset;
        this.latestInputHistoryProperty.triggerFrameReset =
          !this.latestInputHistoryProperty.triggerFrameReset;
      });

      // 現在の最新入力情報を履歴として追加
      var addHistoryData = this.latestInputHistoryProperty;
      addHistoryData.isFreeze = true;
      this.inputHistoryPropertyList.unshift(addHistoryData);

      // 現在の最新入力情報を設定
      this.inputHistoryPropertyList.forEach((element: any, index: number) => {
        element.isFreeze = true; // 既存のインスタンスのisFreezeをtrueにする
        element.index = index; // インデックスを割り当てる
      });

      // 直前の入力情報にフレーム数を設定
      if (this.inputHistoryPropertyList.length > 0) {
        this.inputHistoryPropertyList[0].initialFrameCount =
          data.previous_push_frame;
      }

      // 最新入力情報を反映
      this.latestInputHistoryProperty = latestInput[latestInput.length - 1];

      // 最新入力以外をすべて履歴として追加
      for (let i = 0; i < latestInput.length - 1; i++) {
        this.inputHistoryPropertyList.unshift(latestInput[i]);
      }

      // 制限数を超えている分の履歴データを削除
      while (
        this.inputHistoryPropertyList.length >
        this.displayHistoryCount - 1
      ) {
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
        "border-top": "1px solid lightgray",
        "border-image": `linear-gradient(to right, lightgray, ${store.state.backgroundColor} 15rem, ${store.state.backgroundColor} 100%)`,
        "border-image-slice": 1,
        position: "relative",
      };
    },
    borderIconStyle() {
      return {
        position: "absolute",
        "margin-top": "-0.6rem",
        left: 0,
        color: "lightgray",
        "font-size": "0.8rem",
      };
    },
  },
  mounted() {
    this.setPresetNameList();

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

    // 初期入力表示をニュートラルに設定
    this.latestInputHistoryProperty.directionFileData =
      this.direction_image[5 - 1].fileData;

    // 空白をキー入力履歴数分だけ追加
    this.inputHistoryPropertyList = Array.from(
      { length: this.displayHistoryCount },
      () => {
        return {
          directionFileData: this.direction_image[5 - 1].fileData,
          buttonFileData: [],
          initialFrameCount: 1,
          isFreeze: true,
          triggerFrameReset: false,
        };
      }
    );
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

      <div v-if="inputHistoryDisplayType === 0" class="px-5 py-3">
        <!-- ストリートファイター6風 -->
        <!-- リアルタイムフレームカウント要素 -->
        <div :style="borderStyle">
          <i class="bi bi-circle-fill" :style="borderIconStyle"></i>
          <KeyInputElement
            :directionFileData="
              this.latestInputHistoryProperty['directionFileData']
            "
            :buttonFileData="this.latestInputHistoryProperty['buttonFileData']"
            :initialFrameCount="
              this.latestInputHistoryProperty['initialFrameCount']
            "
            :isFreeze="this.latestInputHistoryProperty['isFreeze']"
            :triggerFrameReset="
              this.latestInputHistoryProperty['triggerFrameReset']
            "
            :historyDisplayType="inputHistoryDisplayType"
          />
        </div>

        <!-- 履歴表示 -->
        <div
          :style="borderStyle"
          v-for="inputHistoryProperty in inputHistoryPropertyList"
          :key="inputHistoryProperty.index"
        >
          <i class="bi bi-circle-fill" :style="borderIconStyle"></i>
          <KeyInputElement
            :directionFileData="inputHistoryProperty['directionFileData']"
            :buttonFileData="inputHistoryProperty['buttonFileData']"
            :initialFrameCount="inputHistoryProperty['initialFrameCount']"
            :isFreeze="inputHistoryProperty['isFreeze']"
            :historyDisplayType="inputHistoryDisplayType"
          />
        </div>
      </div>

      <div
        v-if="inputHistoryDisplayType === 1"
        class="d-flex flex-row-reverse justify-content-end align-items-end gap-2 ms-3"
      >
        <!-- 鉄拳風 -->
        <!-- リアルタイムフレームカウント要素 -->
        <div>
          <KeyInputElement
            :directionFileData="
              this.latestInputHistoryProperty['directionFileData']
            "
            :buttonFileData="this.latestInputHistoryProperty['buttonFileData']"
            :initialFrameCount="
              this.latestInputHistoryProperty['initialFrameCount']
            "
            :isFreeze="this.latestInputHistoryProperty['isFreeze']"
            :triggerFrameReset="
              this.latestInputHistoryProperty['triggerFrameReset']
            "
            :historyDisplayType="inputHistoryDisplayType"
          />
        </div>

        <!-- 履歴表示 -->
        <div
          v-for="inputHistoryProperty in inputHistoryPropertyList"
          :key="inputHistoryProperty.index"
        >
          <KeyInputElement
            :directionFileData="inputHistoryProperty['directionFileData']"
            :buttonFileData="inputHistoryProperty['buttonFileData']"
            :initialFrameCount="inputHistoryProperty['initialFrameCount']"
            :isFreeze="inputHistoryProperty['isFreeze']"
            :historyDisplayType="inputHistoryDisplayType"
          />
        </div>
      </div>

      <div
        v-if="inputHistoryDisplayType === 2"
        class="d-flex flex-row-reverse justify-content-end align-items-end gap-2 ms-3"
      >
        <!-- RTA形式 -->
        <!-- リアルタイムフレームカウント要素 -->
        <div>
          <KeyInputElement
            :directionFileData="
              this.latestInputHistoryProperty['directionFileData']
            "
            :buttonFileData="this.latestInputHistoryProperty['buttonFileData']"
            :initialFrameCount="
              this.latestInputHistoryProperty['initialFrameCount']
            "
            :isFreeze="true"
            :triggerFrameReset="
              this.latestInputHistoryProperty['triggerFrameReset']
            "
            :historyDisplayType="inputHistoryDisplayType"
          />
        </div>

        <!-- 履歴表示 -->
        <div
          v-for="inputHistoryProperty in inputHistoryPropertyList"
          :key="inputHistoryProperty.index"
        >
          <KeyInputElement
            :directionFileData="inputHistoryProperty['directionFileData']"
            :buttonFileData="inputHistoryProperty['buttonFileData']"
            :initialFrameCount="inputHistoryProperty['initialFrameCount']"
            :isFreeze="true"
            :historyDisplayType="inputHistoryDisplayType"
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

.key-input-border-icon {
  position: absolute;
  margin-top: -0.7rem;
  left: 0;
}

.input-history-area {
  height: 120vh;
}
</style>
