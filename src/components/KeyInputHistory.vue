<script lang="tsx">
import { PropType, defineComponent } from "vue";
import Vue from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import KeyInputElement from "./KeyInputElement.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import { DropdownImage } from "@/button-pict-setting";
import store from "@/store";

export default defineComponent({
  name: "KeyInputHistory",
  components: {
    KeyInputElement,
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      selectedGamepadIndex: "",

      previoutInputInfo: new GamepadKeyInputInfo(),
      inputInfo: new GamepadKeyInputInfo(),

      buttonPictSetting: new ButtonPictSetting(""),
      inputHistoryPropertyList: [] as any,

      dropdown_images: [] as DropdownImage[],
    };
  },
  methods: {
    updateGamepads() {
      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
    },
    onChangeGamepadSelection() {
      // 保存済みのボタン設定を取得
      if (!(this.selectedGamepadIndex === "")) {
        this.buttonPictSetting = store.getters.getButtonPictSetting(
          this.gamepads[Number(this.selectedGamepadIndex)].id
        );

        console.log(
          "Loaded buttonPictSetting. GamepadId : " +
            this.buttonPictSetting.gamepadId
        );
        console.log(this.buttonPictSetting);
      }
    },
    addInputHistory() {
      // this.inputInfoから、キー入力履歴を追加

      var buttonFileData = [];

      for (var i = 0; i < 16; i++) {
        if (this.inputInfo.buttonPressState(i)) {
          // ボタンが押されている
          // 対応する画像データを追加
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
        }
      }

      const options = {
        directionFileData: "direction",
        buttonFileData: buttonFileData,
        initialFrameCount: 50,
        isFreeze: false,
      };

      // 先頭にプロパティを追加
      this.inputHistoryPropertyList.unshift(options);

      // 制限数を超えている分を削除
      while (this.inputHistoryPropertyList.length > 10) {
        this.inputHistoryPropertyList.pop();
      }
    },
    onGameLoop(
      debugInfo: DebugInfomation,
      keyPressState: GamepadKeyPressState[]
    ) {
      if (this.selectedGamepadIndex === "") {
        return;
      }
      // 選択されているゲームパッドの入力情報を取得
      const selectedGamepad = keyPressState.find(
        (gp) =>
          gp.gamepadId === this.gamepads[Number(this.selectedGamepadIndex)].id
      );

      if (selectedGamepad === undefined) {
        // ゲームパッドが見つからない場合は何もしない
        return;
      }

      // 前フレームの入力情報を退避
      this.previoutInputInfo = this.inputInfo;

      // このフレームのゲームパッド入力情報を取得
      this.inputInfo = selectedGamepad.inputInfo;

      // 変化している場合、キー入力履歴を追加
      if (!this.inputInfo.equals(this.previoutInputInfo)) {
        console.log("Input changed!");
        this.addInputHistory();
      }
    },
  },
  mounted() {
    this.updateGamepads();
    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);

    // 保存済みのボタン設定を取得
    if (!(this.selectedGamepadIndex === "")) {
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.gamepads[Number(this.selectedGamepadIndex)].id
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

    const gameLoop = GameLoop.instance;
    gameLoop.executeGameLoop(this.onGameLoop);
  },
  beforeUnmount() {
    window.removeEventListener("gamepadconnected", this.updateGamepads);
    window.removeEventListener("gamepaddisconnected", this.updateGamepads);
  },
});
</script>

<template>
  <div>
    <p>キー入力履歴表示領域</p>
  </div>

  <div>
    <select v-model="selectedGamepadIndex" @change="onChangeGamepadSelection">
      <option
        v-for="gamepad in gamepads"
        :key="gamepad.id"
        :value="gamepad.index"
      >
        {{ gamepad.id }}
      </option>
    </select>
  </div>

  <div id="input-history-area">
    <button @click="addInputHistory">履歴追加</button>

    <div
      v-for="(inputHistoryProperty, index) in inputHistoryPropertyList"
      :key="index"
    >
      <KeyInputElement
        :directionFileData="inputHistoryProperty['directionFileData']"
        :buttonFileData="inputHistoryProperty['buttonFileData']"
        :initialFrameCount="inputHistoryProperty['initialFrameCount']"
        :isFreeze="inputHistoryProperty['isFreeze']"
      />
    </div>
  </div>
</template>
