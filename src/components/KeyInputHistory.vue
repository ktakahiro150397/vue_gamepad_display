<script lang="tsx">
import { PropType, defineComponent } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
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
      var data = await GetServerInfo.getDevices();

      this.devices = data.devices;

      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
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
            parsed["time_stamp"]
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

      const options = {
        directionFileData: directionFileData,
        buttonFileData: [],
        initialFrameCount: 1,
        isFreeze: false,
        domId: this.generateDomId(),
      };

      // プロパティを末尾に追加
      this.inputHistoryPropertyList.unshift(options);
    },
    addInputHistory() {
      // TODO : APIからの戻り値からキー入力履歴を追加
      // this.inputInfoから、キー入力履歴を追加

      var buttonFileData = [];
      var isUp = false;
      var isDown = false;
      var isLeft = false;
      var isRight = false;

      // 押下されているボタンの確認
      for (var i = 0; i < 16; i++) {
        if (this.inputInfo.buttonPressState(i)) {
          // ボタンが押されている
          // 対応するボタン画像データを追加
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
              if (fileData !== undefined) {
                buttonFileData.push(fileData);
              }
            }
          }

          // 押下されている方向キーの確認
          if (this.buttonPictSetting.settings[i].isDirectionalPad) {
            // 方向キーが押されている
            switch (this.buttonPictSetting.settings[i].directionalValue) {
              case 0:
                isUp = true;
                break;
              case 1:
                isDown = true;
                break;
              case 2:
                isLeft = true;
                break;
              case 3:
                isRight = true;
                break;
            }
          }
        }
      }

      var directionFileData;
      // 押下方向に応じて画像データを割り当て(テンキー方式のファイル順前提)
      if (isDown) {
        if (isLeft) {
          directionFileData = this.direction_image[1 - 1].fileData;
        } else if (isRight) {
          directionFileData = this.direction_image[3 - 1].fileData;
        } else {
          directionFileData = this.direction_image[2 - 1].fileData;
        }
      } else if (isUp) {
        if (isLeft) {
          directionFileData = this.direction_image[7 - 1].fileData;
        } else if (isRight) {
          directionFileData = this.direction_image[9 - 1].fileData;
        } else {
          directionFileData = this.direction_image[8 - 1].fileData;
        }
      } else if (isLeft) {
        directionFileData = this.direction_image[4 - 1].fileData;
      } else if (isRight) {
        directionFileData = this.direction_image[6 - 1].fileData;
      } else {
        // ニュートラル
        directionFileData = this.direction_image[5 - 1].fileData;
      }

      const options = {
        directionFileData: directionFileData,
        buttonFileData: buttonFileData,
        initialFrameCount: 1,
        isFreeze: false,
        domId: this.generateDomId(),
      };

      // プロパティを末尾に追加
      this.inputHistoryPropertyList.unshift(options);

      // 制限数を超えている分を削除
      while (this.inputHistoryPropertyList.length > 10) {
        this.inputHistoryPropertyList.pop();
      }

      //   console.log("Add input history");
      //   console.log(this.inputHistoryPropertyList);
    },
  },
  mounted() {
    this.updateGamepads();
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
  <div>
    <p>キー入力履歴表示領域</p>
  </div>

  <div>
    <p>ブラウザに接続されているゲームパッド</p>
    <select v-model="selectedGamepadId" @change="onChangeGamepadSelection">
      <option v-for="gamepad in gamepads" :key="gamepad.id" :value="gamepad.id">
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

  <div id="input-history-area">
    <button @click="addInputHistory">履歴追加</button>

    <div
      v-for="inputHistoryProperty in inputHistoryPropertyList"
      :key="inputHistoryProperty.domId"
    >
      <KeyInputElement
        :directionFileData="inputHistoryProperty['directionFileData']"
        :buttonFileData="inputHistoryProperty['buttonFileData']"
        :initialFrameCount="inputHistoryProperty['initialFrameCount']"
        :isFreeze="inputHistoryProperty['isFreeze']"
        ref="keyInputElement"
      />
    </div>
  </div>
</template>
