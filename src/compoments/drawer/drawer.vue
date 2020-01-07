<template>
  <div class="drawer-content">
    <div class="drawer-main-header">
      <div class="menu-icon-header-container"
           @click="$emit('close')">
        <i data-eva="arrow-ios-back-outline"
           data-eva-animation="zoom"
           data-eva-fill="#fff"
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
  /* background-color: #fff; */
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.drawer-main-header {
  background-color: #1f487e;
  background-image: radial-gradient(circle at top right, #04092d, #1d3461);
  height: 56px;
  width: 100%;
  position: relative;
  display: flex;
  color: #fff;
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
  background-image: radial-gradient(
    circle at top right,
    #6290c8,
    #829cbc,
    #829cbc
  );
}
.drawer-main-footer {
  height: 56px;
  width: 100%;
  position: relative;
  background-color: #1f487e;
  background-image: radial-gradient(circle, #1d3461, #04092d);
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
