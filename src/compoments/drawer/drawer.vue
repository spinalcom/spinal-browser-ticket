<template>
  <div class="drawer-content">
    <div class="drawer-main-header">
      <div class="menu-icon-header-container"
           @click="$emit('close')">
        <i data-eva="arrow-ios-back-outline"
           data-eva-animation="zoom"
           data-eva-height="24"
           data-eva-width="24"></i>
      </div>
    </div>
    <div class="drawer-main-content">
      <appList></appList>
    </div>
    <div class="drawer-main-footer">
      <langSelector></langSelector>
    </div>

  </div>
</template>

<script>
import langSelector from "./langSelector/langSelector.vue";
import appList from "./appList/appList.vue";
import * as eva from "eva-icons";

export default {
  data() {
    return {};
  },
  name: "drawer",
  components: { langSelector, appList },
  mounted() {
    eva.replace();
  }
};
</script>

<style>
.drawer-content {
  background-color: #fff;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.drawer-main-header {
  background-color: #1f487e;
  height: 56px;
  width: 100%;
  position: relative;
  display: flex;
}
.drawer-main-header > * {
  align-self: center;
}
.drawer-content .drawer-main-content {
  height: calc(100% - 112px);
  width: 100%;
  position: relative;
  overflow: auto;

  background-color: #829cbc;
}
.drawer-main-footer {
  height: 56px;
  width: 100%;
  position: relative;
  background-color: #1f487e;
  display: flex;
  justify-content: center;
}
.drawer-main-footer > * {
  align-self: flex-end;
  padding-bottom: 8px;
}
.menu-icon-header-container {
  cursor: pointer;
}
</style>
