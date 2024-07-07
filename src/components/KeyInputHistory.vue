<script lang="tsx">
import { PropType, defineComponent } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import ButtonPromptDropdown from "./ButtonPromptDropdown.vue";
import DirectionPromptDropdown from "./DirectionPromptDropdown.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import store from "@/store";

export default defineComponent({
  name: "KeyInputHistory",
  data() {
    return {
      gamepads: [] as Gamepad[],
      selectedGamepadIndex: "",
      inputInfo: new GamepadKeyInputInfo(),
      buttonPictSetting: new ButtonPictSetting(""),
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
    onGameLoop(
      debugInfo: DebugInfomation,
      keyPressState: GamepadKeyPressState[]
    ) {
      // 選択されているゲームパッドの入力情報を取得
      const selectedGamepad = keyPressState.find(
        (gp) => gp.gamepadId === this.selectedGamepadIndex
      );

      if (selectedGamepad === undefined) {
        // ゲームパッドが見つからない場合は何もしない
        return;
      }

      // ゲームパッドの入力情報を取得
      this.inputInfo = selectedGamepad.inputInfo;
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

    const gameLoop = GameLoop.instance;
    gameLoop.executeGameLoop(this.onGameLoop);
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
</template>
