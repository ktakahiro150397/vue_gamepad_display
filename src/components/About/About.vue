<script lang="ts">
import { defineComponent } from "vue";
import AboutThisApp from "./AboutThisApp.vue";
import Contribution from "./Contribution.vue";
import Credit from "./Credit.vue";

export default defineComponent({
  name: "AboutPage",
  components: {
    AboutThisApp,
    Contribution,
    Credit,
  },
  data() {
    return {
      currentTab: "AboutThisApp",
    };
  },
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- サイドメニュー -->
      <nav class="col-md-3 d-none d-md-block sidebar">
        <div class="sidebar-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a
                class="nav-link active"
                :class="{ contentActive: currentTab === 'AboutThisApp' }"
                @click="currentTab = 'AboutThisApp'"
              >
                <i class="bi bi-joystick"></i>
                このアプリについて
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                :class="{ contentActive: currentTab === 'Contribution' }"
                @click="currentTab = 'Contribution'"
              >
                <i class="bi bi-github"></i>
                GitHub
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                :class="{ contentActive: currentTab === 'Credit' }"
                @click="currentTab = 'Credit'"
              >
                <i class="bi bi-person-heart"></i>
                クレジット
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="col-md-9">
        <component :is="currentTab" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-item {
  /* background-color: inherit; */
}

.nav-item a:hover {
  cursor: pointer;
  background-color: lightgrey;
}

.nav-item .contentActive {
  font-weight: bold;
}
</style>
