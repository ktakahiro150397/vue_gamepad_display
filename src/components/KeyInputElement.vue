<script lang="tsx">
import { PropType, defineComponent } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import ButtonPromptDropdown from "./ButtonPromptDropdown.vue";
import DirectionPromptDropdown from "./DirectionPromptDropdown.vue";
import { ButtonPictSetting } from "@/button-pict-setting";
import store from "@/store";

export default defineComponent({
  name: "KeyInputElement",
  props: {
    directionFileData: {
      type: String,
      required: true,
    },
    buttonFileData: {
      type: Array as PropType<string[]>,
      required: true,
    },
    initialFrameCount: {
      type: Number,
      required: false,
      default: 1,
    },
    isFreeze: {
      type: Boolean,
      required: false,
      default: false,
    },
    startFrameCount: {
      type: Number,
      required: false,
      default: 0,
    },
    endFrameCount: {
      type: Number,
      required: false,
      default: 0,
    },
    backgroundColor: {
      type: String,
      required: false,
      default: "#00ff00",
    },
  },
  methods: {
    onGameLoop(
      debugInfo: DebugInfomation,
      keyPressState: GamepadKeyPressState[]
    ) {
      if (!this.isFreeze && this.currentFrameCount < 99) {
        // 固定されていない場合、フレームカウントを更新
        this.currentFrameCount += 1;
      }
    },
  },
  data() {
    return {
      currentFrameCount: this.initialFrameCount,
    };
  },
  watch: {
    initialFrameCount() {
      this.currentFrameCount = this.initialFrameCount;
    },
  },
  mounted() {
    const gameLoop = GameLoop.instance;
    gameLoop.executeGameLoop(this.onGameLoop);
  },
});
</script>

<template>
  <div class="keyinput-container" :style="{ backgroundColor: backgroundColor }">
    <div class="frame-count-container">
      <span class="frame-count">{{ currentFrameCount }}</span>
    </div>

    <!-- 方向キー表示 -->
    <div>
      <img :src="directionFileData" class="keyinput-direction-img" />
    </div>

    <!-- ボタン表示 -->
    <div v-if="buttonFileData.length" class="keyinput-button-cotainer">
      <img
        v-for="(fileData, index) in buttonFileData"
        :key="index"
        :src="fileData"
        class="keyinput-button-img"
      />
    </div>
    <div v-else></div>
  </div>
</template>

<style scoped>
.keyinput-container {
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 0;
}

.frame-count-container {
  min-width: 60px;
  height: 50px;

  display: flex;
  justify-content: right;
  align-items: center;
}

.frame-count {
  font-size: 24px;
}

.keyinput-direction-img {
  width: 32px;
  height: 32px;
}
.keyinput-button-img {
  width: 38px;
  height: 38px;
}

.keyinput-button-cotainer {
  display: flex;
  gap: 5px;
  align-items: center;
  /* background-color: violet; */
}
</style>
