<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";
import {
  KeyHistoryDisplayType,
  KeyInputHistoryDropdownItem,
} from "@/display-type";
import { Device, GetServerInfo } from "@/api/get-server-info";

export default defineComponent({
  name: "SiteSettings",
  components: {},
  data() {
    return {
      backgroundColor: store.state.backgroundColor,
      serverUrl: store.state.serverUrl,
      isUseTestInputStream: store.state.isUseTestInputStream,
      isDisplayFrameCount: store.state.isDisplayFrameCount,
      displayHistoryCount: store.state.displayHistoryCount,

      gamepads: [] as Gamepad[],
      devices: [] as Device[],
      presetNames: [] as string[],
      InputHistoryList: [] as KeyInputHistoryDropdownItem[],

      selectedInputHistoryDisplayType: store.state.inputHistoryDisplayType,
    };
  },
  methods: {
    onChangeBackgroundColor() {
      this.setBackGroundColor(this.backgroundColor);
    },
    onChangeServerUrl() {
      this.setServerUrl(this.serverUrl);
    },
    onChangeIsUseTestInputStream() {
      this.setIsUseTestInputStream(this.isUseTestInputStream);
    },
    onChangeIsDisplayFrameCount() {
      this.setIsDisplayFrameCount(this.isDisplayFrameCount);
    },
    onChangeDisplayType() {
      store.commit(
        "setInputHistoryDisplayType",
        this.selectedInputHistoryDisplayType
      );
    },
    onChangeDisplayHistoryCount() {
      // 入力内容が数値でない場合はエラー
      const txtField = document.getElementById("txtDisplayHistoryCount");

      if (this.displayHistoryCount === "") {
        this.$toast.error("表示キー履歴数を入力してください。");

        txtField?.classList.add("is-invalid");
        return;
      }

      if (isNaN(Number(this.displayHistoryCount))) {
        this.$toast.error("表示キー履歴数は数値で入力してください。");

        txtField?.classList.add("is-invalid");
        return;
      }

      store.commit("setDisplayHistoryCount", this.displayHistoryCount);
      this.$toast.success("表示キー履歴数を変更しました。");
      txtField?.classList.remove("is-invalid");
    },
    setIsUseTestInputStream(isUseTestInputStream: boolean) {
      store.commit("setIsUseTestInputStream", isUseTestInputStream);
    },
    setIsDisplayFrameCount(isDisplayFrameCount: boolean) {
      store.commit("setIsDisplayFrameCount", isDisplayFrameCount);
    },
    setServerUrl(url: string) {
      this.serverUrl = url;
      store.commit("setServerUrl", url);
    },
    setBackGroundColor(color: string) {
      this.backgroundColor = color;
      store.commit("setBackgroundColor", color);
      this.$toast.success("背景色を変更しました。");
    },
  },
  computed: {},
  mounted() {
    // 表示形式のドロップダウン初期化
    Object.values(KeyHistoryDisplayType)
      .filter((value) => typeof value === "number")
      .forEach((value) => {
        this.InputHistoryList.push(
          new KeyInputHistoryDropdownItem(value as KeyHistoryDisplayType)
        );
      });
  },
});
</script>

<template>
  <div class="container-fluid mt-3">
    <div class="card mb-4">
      <div class="card-header">サーバー設定</div>
      <div class="card-body">
        <div class="mb-3 row">
          <div class="col">
            <label class="form-label">入力取得サーバーURL</label>

            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  v-model="serverUrl"
                  @change="onChangeServerUrl"
                />
                <span class="form-text">
                  入力取得を行うサーバーのURLを入力してください。デフォルトは「http://localhost:5000」です。
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="form-switch">
              <input
                id="chkIsUseTestInputStream"
                type="checkbox"
                class="form-check-input"
                v-model="isUseTestInputStream"
                @change="onChangeIsUseTestInputStream"
              />
              <label for="chkIsUseTestInputStream" class="form-check-label ms-2"
                >テスト用の入力ストリームを表示する</label
              >
            </div>
            <span class="form-text">
              実際の入力ではなく、ランダムな入力をサーバーから取得して表示します。(動作確認向け)
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-header">表示設定</div>
      <div class="card-body">
        <div class="mb-3 row">
          <div class="col">
            <label class="form-label">入力履歴背景色</label>
            <input
              type="color"
              class="form-control form-control-color"
              v-model="backgroundColor"
              @change="onChangeBackgroundColor"
            />
          </div>
        </div>

        <div class="mb-4 row">
          <div class="col">
            <label class="form-label col-12">背景色プリセット</label>
            <button
              type="button"
              class="btn btn-color-preset me-2"
              style="color: black"
              @click="setBackGroundColor('#ffffff')"
            >
              Whilte(#FFFFFF)
            </button>
            <button
              type="button"
              class="btn btn-color-preset me-2"
              style="background-color: #00ff00"
              @click="setBackGroundColor('#00ff00')"
            >
              Green(#00FF00)
            </button>
            <button
              type="button"
              class="btn btn-color-preset"
              style="background-color: #552200; color: white"
              @click="setBackGroundColor('#552200')"
            >
              Brown(#552200)
            </button>
          </div>
        </div>

        <div class="mb-3 row">
          <div class="col">
            <div class="mb-1">
              <label class="form-label">キー入力表示形式</label>
              <select
                class="form-select"
                v-model="selectedInputHistoryDisplayType"
                @change="onChangeDisplayType"
              >
                <option
                  v-for="item in InputHistoryList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
              </select>
            </div>

            <div class="form-switch">
              <input
                type="checkbox"
                id="chkIsDisplayFrameCount"
                class="form-check-input"
                v-model="isDisplayFrameCount"
                @change="onChangeIsDisplayFrameCount"
              />
              <label for="chkIsDisplayFrameCount" class="form-check-label ms-2">
                入力フレーム数を表示する
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <label class="form-label">表示キー履歴数</label>

            <div class="row">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  id="txtDisplayHistoryCount"
                  v-model="displayHistoryCount"
                  @change="onChangeDisplayHistoryCount"
                />
                <span class="form-text">
                  入力履歴を表示する最大数を入力してください。デフォルトは「20」です。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-color-preset {
  border: 1px solid black;
}

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
