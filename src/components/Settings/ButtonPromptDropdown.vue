<script lang="tsx">
import { defineComponent } from "vue";
import { DropdownImage } from "@/button-pict-setting";

export default defineComponent({
  name: "ButtonPromptDropdown",
  emits: ["changeDropdownImage"],
  props: {
    buttonIndex: {
      type: Number,
      required: true,
    },
    buttonPromptIndex: {
      type: Number,
      required: true,
    },
    buttonPromptPath: {
      type: String,
      required: false,
      default: "@/assets/button_prompt",
    },
    initialValue: {
      type: String,
      required: false,
      default: "",
    },
  },
  data() {
    return {
      dropdown_images: [] as DropdownImage[],
      selectedImageIndex: -1 as number,
    };
  },
  computed: {
    dropdownHTMLId(): string {
      return (
        "dropdown_buttonPrompt-" +
        this.buttonIndex +
        "-" +
        this.buttonPromptIndex
      );
    },
    selectedImageName(): string {
      return this.getDropdownImageName(this.selectedImageIndex);
    },
  },
  methods: {
    getDropdownImageData(index: number) {
      if (index < 0 || index >= this.dropdown_images.length) {
        return "";
      }
      return this.dropdown_images[index].fileData;
    },
    getDropdownImageName(index: number) {
      if (index < 0 || index >= this.dropdown_images.length) {
        return "";
      }
      return this.dropdown_images[index].fileName;
    },
    onChangeDropdownImage() {
      // ドロップダウンリストの選択が変更されたときの処理
      this.$emit(
        "changeDropdownImage",
        this.buttonIndex,
        this.buttonPromptIndex,
        this.selectedImageIndex,
        this.getDropdownImageName(this.selectedImageIndex)
      );
    },
  },
  watch: {
    initialValue() {
      // 初期値を設定
      if (this.initialValue === "") {
        this.selectedImageIndex = -1;
      } else {
        this.selectedImageIndex = this.dropdown_images.findIndex(
          (image) => image.fileName === this.initialValue
        );
      }
    },
  },
  mounted() {
    // 画面に表示するドロップダウンリストを作成
    // assets/button_promptディレクトリ内のpngファイルをインポート
    const context = require.context("@/assets/button_prompt", true, /\.png$/);

    // インポートしたファイルのファイル名をdropdown_images配列に格納
    this.dropdown_images = context.keys().map((key) => {
      const fileName = key;
      const fileData = context(key);
      return new DropdownImage(fileName, fileData);
    });

    // 初期値を設定
    if (this.initialValue === "") {
      this.selectedImageIndex = -1;
    } else {
      this.selectedImageIndex = this.dropdown_images.findIndex(
        (image) => image.fileName === this.initialValue
      );
      console.log(
        "Initial value : ",
        this.initialValue,
        " / selectedImageIndex : ",
        this.selectedImageIndex
      );
    }
  },
});
</script>

<template>
  <div class="container d-grid d-flex gap-1 align-items-center">
    <select
      :id="dropdownHTMLId"
      class="form-select"
      v-model="selectedImageIndex"
      @change="onChangeDropdownImage"
    >
      <option value="-1">未選択</option>
      <option
        v-for="(image, index) in dropdown_images"
        :key="image.fileName"
        :value="index"
      >
        {{ image.fileName }}
      </option>
    </select>

    <div>
      <img
        v-if="selectedImageIndex >= 0"
        :src="getDropdownImageData(selectedImageIndex)"
        class="dropdown-buttonPrompt-img"
        alt="button_prompt"
      />
      <div v-else class="dropdown-buttonPrompt-img" />
    </div>
  </div>
</template>

<style scoped>
.dropdown-buttonPrompt-img {
  width: 32px;
  height: 32px;
}
</style>
