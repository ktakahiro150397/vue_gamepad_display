<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DirectionPromptDropdown",
  emits: ["changeDropdownDirection"],
  props: {
    buttonIndex: {
      type: Number,
      required: true,
    },
    initialValue: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  data() {
    return {
      selectedIndex: -1 as number,
    };
  },
  computed: {
    dropdownHTMLId(): string {
      return "dropdown_directionPrompt-" + this.buttonIndex;
    },
  },
  methods: {
    onChangeDropdownDirection() {
      // ドロップダウンリストの選択が変更されたときの処理
      console.log("changeDropdownDirection");

      this.$emit(
        "changeDropdownDirection",
        this.buttonIndex,
        this.selectedIndex
      );
    },
  },
  mounted() {
    this.selectedIndex = this.initialValue;
  },
});
</script>

<template>
  <select
    :id="dropdownHTMLId"
    v-model="selectedIndex"
    @change="onChangeDropdownDirection"
  >
    <option :value="-1">未選択</option>
    <option :value="0">上 / ↑</option>
    <option :value="1">下 / ↓</option>
    <option :value="2">左 / ←</option>
    <option :value="3">右 / →</option>
  </select>
</template>
