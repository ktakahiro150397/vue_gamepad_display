<script lang="tsx">
import { PropType, defineComponent } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import store from "@/store";

export default defineComponent({
  name: "InputSettings",
  props: {
    gamepadId: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      selectedGamepadIndex: 0,
      inputInfo: new GamepadKeyInputInfo(),
    };
  },
  methods: {
    updateGamepads() {
      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
    },
    gamepadButtonLabelStyle(isButtonPressed: boolean) {
      return {
        "background-color": isButtonPressed ? "orange" : "#ffffff",
        color: "black",
        border: "1px solid black",
        padding: "5px 10px",
        "border-radius": "5px",
        cursor: "pointer",
      };
    },
    onGameLoop(
      debugInfo: DebugInfomation,
      keyPressState: GamepadKeyPressState[]
    ) {
      // 選択されているゲームパッドの入力情報を取得
      const selectedGamepad = keyPressState.find(
        (gp) => gp.gamepadId === this.gamepadId
      );

      if (selectedGamepad === undefined) {
        // ゲームパッドが見つからない場合は何もしない
        return;
      }

      // ゲームパッドの入力情報を取得
      this.inputInfo = selectedGamepad.inputInfo;
    },
  },
  computed: {
    selectedGamepadId(): string {
      if (this.gamepads.length === 0) {
        return "";
      }

      if (this.selectedGamepadIndex >= this.gamepads.length) {
        return "";
      }

      return this.gamepads[this.selectedGamepadIndex].id;
    },
  },
  mounted() {
    this.updateGamepads();
    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);

    const gameLoop = new GameLoop();
    gameLoop.executeGameLoop(this.onGameLoop);
  },
  beforeUnmount() {
    window.removeEventListener("gamepadconnected", this.updateGamepads);
    window.removeEventListener("gamepaddisconnected", this.updateGamepads);
  },
});
</script>

<template>
  <h1>ボタン表示設定</h1>

  <table>
    <thead>
      <th></th>
      <th>ボタン1</th>
      <th>ボタン2</th>
      <th>ボタン3</th>
      <th>方向キー</th>
    </thead>
    <tbody>
      <tr>
        <td>
          <p :style="gamepadButtonLabelStyle(inputInfo.button1)">Button 1</p>
        </td>
        <td>A</td>
        <td>B</td>
        <td>C</td>
        <td>D</td>
      </tr>
      <tr>
        <td>
          <p :style="gamepadButtonLabelStyle(inputInfo.button2)">Button 2</p>
        </td>
        <td>A</td>
        <td>B</td>
        <td>C</td>
        <td>D</td>
      </tr>
    </tbody>
  </table>
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
