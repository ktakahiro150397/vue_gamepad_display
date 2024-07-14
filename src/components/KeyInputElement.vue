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
  },
  methods: {
    onGameLoop(
      debugInfo: DebugInfomation,
      keyPressState: GamepadKeyPressState[]
    ) {
      if (!this.isFreeze) {
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
  <div class="keyinput-container">
    <div class="frame-count-container">
      <p class="frame-count">{{ currentFrameCount }}</p>
    </div>

    <!-- 方向キー表示 -->
    <img :src="directionFileData" />

    <!-- ボタン表示 -->
    <div v-if="buttonFileData.length" class="keyinput-button-cotainer">
      <img
        v-for="(fileData, index) in buttonFileData"
        :key="index"
        :src="fileData"
      />
    </div>
    <div v-else></div>
  </div>
</template>

<style scoped>
.keyinput-container {
  display: flex;
  gap: 30px;
  align-items: center;
  background-color: orange;
}

.frame-count-container {
  min-width: 60px;
  text-align: right;
}

.frame-count {
  font-size: 28px;
}

.keyinput-container img {
  width: 48px;
  height: 48px;
}

.keyinput-button-cotainer {
  display: flex;
  gap: 10px;
  align-items: center;
  background-color: violet;
}
</style>