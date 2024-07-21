<script lang="tsx">
import { defineComponent } from "vue";
import store from "@/store";

export default defineComponent({
  name: "PadInputDisplaySettings",
  data() {
    return {
      presetNameList: [] as string[],
    };
  },
  methods: {
    onClickSaveButton() {
      console.log("onClickSaveButton");
    },
    onClickDeleteButton() {
      console.log("onClickDeleteButton");
    },
  },
  mounted() {
    this.presetNameList = ["プリセットA", "プリセットB", "プリセットC"];
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
          <div class="col">
            <div class="d-flex justify-content-start align-items-center gap-3">
              <div class="alert alert-info mb-0" role="alert">
                <i class="bi bi-info-circle-fill"></i>
                表示するベース画像・ボタンの座標を入力して「保存」ボタンを押してください。<br />
                パッドのボタンを押すと、対象ボタン名が光ります。
              </div>

              <button
                type="button"
                value="設定を保存"
                @click="onClickSaveButton"
                class="col-2 btn btn-primary"
              >
                保存
              </button>
              <button
                type="button"
                value="設定を削除"
                @click="onClickDeleteButton"
                class="col-auto btn btn-danger"
              >
                削除
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="inputDisplay" class="form-label">プリセット名</label>

          <input list="presetNameDataList" class="form-control" />
          <datalist id="presetNameDataList">
            <option v-for="preset in presetNameList" :key="preset">
              {{ preset }}
            </option>
          </datalist>
        </div>
      </div>
    </div>
  </div>
</template>
