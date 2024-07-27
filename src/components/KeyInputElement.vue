<script lang="tsx">
import { PropType, defineComponent, ref, defineExpose } from "vue";
import { DebugInfomation, GameLoop, GamepadKeyPressState } from "@/gameloop";
import GamepadKeyInputInfo from "@/input-info";
import { KeyHistoryDisplayType } from "@/display-type";
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
    triggerFrameReset: {
      type: Boolean,
      required: false,
      default: false,
    },
    historyDisplayType: {
      type: Number as PropType<KeyHistoryDisplayType>,
      required: true,
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
    resetFrameCount() {
      this.currentFrameCount = 0;
    },
  },
  data() {
    return {
      currentFrameCount: this.initialFrameCount,
      isDisplayFrameCount: store.state.isDisplayFrameCount,
    };
  },
  watch: {
    initialFrameCount() {
      this.currentFrameCount = this.initialFrameCount;
    },
    triggerFrameReset() {
      this.resetFrameCount();
    },
  },
  mounted() {
    if (this.isFreeze || !this.isDisplayFrameCount) {
      // フリーズ状態またはフレームカウント非表示の場合、ゲームループを実行しない
      return;
    } else {
      const gameLoop = GameLoop.instance;
      gameLoop.executeGameLoop(this.onGameLoop);
    }
  },
  onBeforeUnmount() {
    console.log("onBeforeUnmount");
  },
});
</script>

<template>
  <div v-if="historyDisplayType === 0" class="keyinput-container">
    <!-- ストリートファイター6風 -->
    <div class="frame-count-container" v-if="isDisplayFrameCount">
      <span class="frame-count">{{ currentFrameCount }}</span>
    </div>
    <div class="frame-count-blank-container" v-else></div>

    <!-- 方向キー表示 -->
    <div style="margin-right: 5px">
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

  <div v-if="historyDisplayType === 1">
    <!-- 鉄拳風 -->
    <div
      class="keyinput-container-horizontal d-flex flex-column align-items-center"
    >
      <!-- ボタン表示 -->
      <div
        v-if="buttonFileData.length"
        class="keyinput-button-cotainer-horizontal d-flex flex-column justify-content-end align-items-center gap-1"
      >
        <img
          v-for="(fileData, index) in buttonFileData"
          :key="index"
          :src="fileData"
          class="keyinput-button-img"
        />
      </div>
      <div v-else class="keyinput-button-cotainer-horizontal"></div>

      <!-- 方向キー表示 -->
      <div class="mt-1">
        <img :src="directionFileData" class="keyinput-direction-img" />
      </div>

      <div v-if="isDisplayFrameCount">
        <span class="frame-count">{{ currentFrameCount }}</span>
      </div>
      <div class="frame-count-blank-container" v-else></div>
    </div>
  </div>

  <div v-if="historyDisplayType === 2">
    <!-- RTA風 -->
    <div
      class="keyinput-container-horizontal d-flex flex-column align-items-center"
    >
      <!-- 方向キー表示 -->
      <div class="" v-if="directionFileData">
        <img :src="directionFileData" class="keyinput-direction-img" />
      </div>
      <!-- ボタン表示 -->
      <div
        v-else-if="buttonFileData.length"
        class="d-flex flex-column justify-content-end align-items-center gap-1"
      >
        <img
          v-for="(fileData, index) in buttonFileData"
          :key="index"
          :src="fileData"
          class="keyinput-button-img"
        />
      </div>
      <div v-else class=""></div>
    </div>
  </div>
</template>

<style scoped>
.keyinput-container-horizontal {
  width: 38px;
}

.keyinput-button-cotainer-horizontal {
  height: 250px;
}

.keyinput-container {
  display: flex;
  align-items: center;
  margin: 0;
}

.frame-count-blank-container {
  width: 20px;
  height: 40px;
}

.frame-count-container {
  min-width: 60px;
  height: 40px;
  margin-right: 20px;

  display: flex;
  justify-content: right;
  align-items: center;
}

.frame-count {
  /* font-family: "Meiryo", "MS PMincho", "HG創英角ﾎﾟｯﾌﾟ体", sans-serif; */
  font-family: "RocknRoll One", "Train One", "IBM Plex Sans JP", sans-serif;

  font-size: 28px;
  font-weight: normal;
  font-style: normal;
  color: white;
  /* -webkit-text-stroke: 1px #756f69; */
}

.keyinput-direction-img {
  width: 30px;
  height: 30px;
}
.keyinput-button-img {
  width: 30px;
  height: 30px;
}

.keyinput-button-cotainer {
  display: flex;
  gap: 5px;
  align-items: center;
}
</style>
