<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AboutPage",
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
      <nav
        class="col-md-3 d-none d-md-block bg-light sidebar"
        style="height: 100%"
      >
        <div class="sidebar-sticky">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a
                class="nav-link active"
                :class="{ contentActive: currentTab === 'AboutThisApp' }"
                @click="currentTab = 'AboutThisApp'"
              >
                <span data-feather="home"></span>
                このアプリについて
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active"
                :class="{ contentActive: currentTab === 'Contribution' }"
                @click="currentTab = 'Contribution'"
              >
                <span data-feather="home"></span>
                コントリビューション
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div class="col-md-9" style="background-color: orange">
        <!-- 表示コンテンツ -->
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
        <p>About page</p>
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
