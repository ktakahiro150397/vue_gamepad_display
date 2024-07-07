<script lang="tsx">
import { defineComponent } from "vue";
export default defineComponent({
  name: "KeyInputHistory",
  data() {
    return {
      selectedGamepadId: "",
    };
  },
});
</script>

<template>
  <div>
    <p>キー入力履歴表示領域</p>
  </div>
</template>
