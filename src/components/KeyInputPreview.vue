<script lang="tsx">
import { defineComponent, PropType } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";

export default defineComponent({
  name: "KeyInputPreview",
  props: {
    gamepadId: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      inputInfo: new GamepadKeyInputInfo(),
    };
  },
  methods: {
    updateGamepads() {
      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );
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
  <h1>キー入力プレビュー</h1>
  <div>
    <p>{{ gamepadId }}</p>
    <p>buttonLength : {{ inputInfo.buttonLength }}</p>
  </div>

  <div style="display: flex; gap: 30px">
    <div>
      <div>
        <p>Button 1</p>
        <p>{{ inputInfo.button1 }}</p>
      </div>
      <div>
        <p>Button 2</p>
        <p>{{ inputInfo.button2 }}</p>
      </div>
      <div>
        <p>Button 3</p>
        <p>{{ inputInfo.button3 }}</p>
      </div>
      <div>
        <p>Button 4</p>
        <p>{{ inputInfo.button4 }}</p>
      </div>
      <div>
        <p>Button 5</p>
        <p>{{ inputInfo.button5 }}</p>
      </div>
      <div>
        <p>Button 6</p>
        <p>{{ inputInfo.button6 }}</p>
      </div>
      <div>
        <p>Button 7</p>
        <p>{{ inputInfo.button7 }}</p>
      </div>
      <div>
        <p>Button 8</p>
        <p>{{ inputInfo.button8 }}</p>
      </div>
    </div>
    <div>
      <div>
        <p>Button 9</p>
        <p>{{ inputInfo.button9 }}</p>
      </div>
      <div>
        <p>Button 10</p>
        <p>{{ inputInfo.button10 }}</p>
      </div>
      <div>
        <p>Button 11</p>
        <p>{{ inputInfo.button11 }}</p>
      </div>
      <div>
        <p>Button 12</p>
        <p>{{ inputInfo.button12 }}</p>
      </div>
      <div>
        <p>Button 13</p>
        <p>{{ inputInfo.button13 }}</p>
      </div>
      <div>
        <p>Button 14</p>
        <p>{{ inputInfo.button14 }}</p>
      </div>
      <div>
        <p>Button 15</p>
        <p>{{ inputInfo.button15 }}</p>
      </div>
      <div>
        <p>Button 16</p>
        <p>{{ inputInfo.button16 }}</p>
      </div>
    </div>
  </div>

  <div>
    <div v-for="(axis, index) in inputInfo.axisStates" :key="index">
      <p>Axis {{ index }}</p>
      <p>{{ axis }}</p>
    </div>
  </div>
</template>
