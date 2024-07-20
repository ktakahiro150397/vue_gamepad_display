<script lang="tsx">
import { PropType, defineComponent } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import ButtonPromptDropdown from "./ButtonPromptDropdown.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import store from "@/store";
import { useToast } from "vue-toast-notification";

export default defineComponent({
  name: "InputSettings",
  emits: ["onSaveButtonSetting", "onDeleteButtonSetting"],
  components: {
    ButtonPromptDropdown,
  },
  props: {
    presetName: {
      type: String as PropType<string>,
      required: true,
    },
    gamepadId: {
      type: String as PropType<string>,
      required: true,
    },
    deviceId: {
      type: String as PropType<string>,
      required: true,
    },
  },
  data() {
    return {
      gamepads: [] as Gamepad[],
      selectedGamepadIndex: 0,
      inputInfo: new GamepadKeyInputInfo(),
      buttonPictSetting: new ButtonPictSetting(
        this.presetName,
        this.gamepadId,
        this.deviceId
      ),
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
    getCurrentSettingData(): ButtonPictSetting {
      // 画面に入力されているボタンの設定内容を取得
      this.buttonPictSetting.presetName = this.presetName;
      this.buttonPictSetting.gamepadId = this.gamepadId;
      this.buttonPictSetting.device_id = this.deviceId;

      // ボタン設定
      var buttonDropdowns = this.$refs.buttonPromptDropdown as any;

      for (var i = 0; i < 16; i++) {
        // ボタン1-3の設定を取得
        for (var j = 0; j < 3; j++) {
          this.buttonPictSetting.settings[i].pictFileNames[j] =
            buttonDropdowns[i * 3 + j].selectedImageName;
        }
      }

      return this.buttonPictSetting;
    },
    onClickSaveButton() {
      // ボタンの設定内容を取得し、保存する
      const currentSettingData = this.getCurrentSettingData();
      store.commit("setButtonPictSetting", currentSettingData);

      this.$toast.success(
        "プリセット名「" +
          this.presetName +
          "」でボタン表示設定を保存しました。"
      );

      this.$emit("onSaveButtonSetting");
    },
    onClickDeleteButton() {
      // 現在のプリセットを削除する
      if (
        window.confirm(
          "プリセット名「" +
            this.presetName +
            "」のボタン表示設定を削除しますか？"
        ) == false
      ) {
        return;
      }

      store.commit("deleteButtonPictSetting", {
        presetName: this.presetName,
        gamepadId: this.gamepadId,
        device_id: this.deviceId,
      });

      this.$toast.warning(
        "プリセット名「" +
          this.presetName +
          "」のボタン表示設定を削除しました。"
      );

      this.$emit("onDeleteButtonSetting");
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
  watch: {
    presetName() {
      // プリセット名選択が変更されたときの処理

      // 保存済みのボタン設定を取得
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.presetName,
        this.gamepadId,
        this.deviceId
      );
    },
    gamepadId() {
      // ゲームパッドの選択が変更されたときの処理

      // 保存済みのボタン設定を取得
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.presetName,
        this.gamepadId,
        this.deviceId
      );
    },
    deviceId() {
      // ゲームパッドの選択が変更されたときの処理

      // 保存済みのボタン設定を取得
      this.buttonPictSetting = store.getters.getButtonPictSetting(
        this.presetName,
        this.gamepadId,
        this.deviceId
      );
    },
  },
  mounted() {
    this.updateGamepads();
    window.addEventListener("gamepadconnected", this.updateGamepads);
    window.addEventListener("gamepaddisconnected", this.updateGamepads);

    // 保存済みのボタン設定を取得
    this.buttonPictSetting = store.getters.getButtonPictSetting(
      this.gamepadId,
      this.deviceId
    );

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
  <h1>ボタン表示設定</h1>

  <input type="button" value="設定を保存" @click="onClickSaveButton" />
  <input type="button" value="設定を削除" @click="onClickDeleteButton" />

  <table>
    <thead>
      <th></th>
      <th>ボタン1</th>
      <th>ボタン2</th>
      <th>ボタン3</th>
    </thead>
    <tbody>
      <tr v-for="index_button in 16" :key="index_button">
        <td>
          <p
            :style="
              gamepadButtonLabelStyle(
                inputInfo.buttonPressState(index_button - 1)
              )
            "
          >
            Button {{ index_button }}
          </p>
        </td>

        <td v-for="index_button_prompt in 3" :key="index_button_prompt">
          <ButtonPromptDropdown
            :buttonIndex="index_button"
            :buttonPromptIndex="index_button_prompt"
            :initialValue="
              buttonPictSetting.settings[index_button - 1].pictFileNames[
                index_button_prompt - 1
              ]
            "
            ref="buttonPromptDropdown"
          ></ButtonPromptDropdown>

          {{
            buttonPictSetting.settings[index_button - 1].pictFileNames[
              index_button_prompt - 1
            ]
          }}
        </td>
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
