<script lang="tsx">
import { defineComponent } from "vue";
import PadInputDisplayKeySettings from "./Settings/PadInputDisplayKeySettings.vue";
import store from "@/store";

export default defineComponent({
  name: "PadInputDisplaySettings",
  components: {
    PadInputDisplayKeySettings,
  },
  data() {
    return {
      presetNameList: [] as string[],
      gamepads: [] as Gamepad[],

      selectedPresetName: "",
      selectedGamepadId: "",
    };
  },
  methods: {
    onClickSaveButton() {
      console.log("onClickSaveButton");
    },
    onClickDeleteButton() {
      console.log("onClickDeleteButton");
    },
    onChangeGamepadSelection() {
      console.log("onChangeGamepadSelection");
    },
    async updateGamepads() {
      this.gamepads = Array.from(navigator.getGamepads()).filter(
        (gp): gp is Gamepad => gp !== null
      );

      if (this.gamepads.length > 0) {
        this.selectedGamepadId = this.gamepads[0].id;
        this.onChangeGamepadSelection();
      }
    },
  },
  mounted() {
    this.presetNameList = ["プリセットA", "プリセットB", "プリセットC"];

    this.updateGamepads();
  },
});
</script>

<template>
  <div class="container-fluid mt-3">
    <div class="card mb-3">
      <div class="card-header">画像アップロード</div>

      <div class="row mt-3">
        <div class="col mx-3">
          <div class="alert alert-info" role="alert">
            <i class="bi bi-info-circle-fill"></i>
            パッド入力表示に使用する画像をアップロードしてください。
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col mx-3">
          <input type="file" class="form-control" accept="image/*" />
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">入力画像表示設定</div>
      <div class="card-body">
        <div class="row mb-3">
          <div class="form-group">
            <label for="inputDisplay" class="form-label">プリセット名</label>

            <input
              list="presetNameDataList"
              class="form-control"
              v-model="selectedPresetName"
            />
            <datalist id="presetNameDataList">
              <option v-for="preset in presetNameList" :key="preset">
                {{ preset }}
              </option>
            </datalist>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col">
            <label class="form-label"
              >ブラウザに接続されているゲームパッド(プレビュー表示用)</label
            >
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

        <div class="row mb-3">
          <PadInputDisplayKeySettings
            :preset-name="selectedPresetName"
            :gamepad-id="selectedGamepadId"
            :device-id="''"
          />
        </div>
      </div>
    </div>
  </div>
</template>
