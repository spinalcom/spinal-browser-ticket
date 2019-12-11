<template>
  <el-container class="body-container"
                v-loading="loading">
    <el-header class="main-header">
      <spinal-header></spinal-header>
    </el-header>
    <div class="body-main-container">
      <el-aside width="201px"
                class="side-bar-container">
        <spinal-side-bar></spinal-side-bar>
      </el-aside>
      <mainContent></mainContent>
    </div>
  </el-container>
</template>

<script>
import Vue from "vue";
import spinalHeader from "./compoments/header/header";
import spinalSideBar from "./compoments/sidebar/sidebar";
import spinalBackEnd from "./services/spinalBackend";
import mainContent from "./compoments/mainContent/index";
export default Vue.extend({
  data() {
    return {
      loading: true
    };
  },
  components: {
    "spinal-header": spinalHeader,
    "spinal-side-bar": spinalSideBar,
    mainContent
  },
  mounted() {
    spinalBackEnd.getGraph().then(() => {
      this.loading = false;
    });
  },
  methods: {}
});
</script>

<style scoped>
.body-container {
  height: 100%;
  width: 100%;
}
.body-main-container {
  height: 100%;
  display: flex;
  position: relative;
}
.side-bar-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 201px;
  height: 100%;
  overflow: auto;
}
.side-bar-container * {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.side-bar-container span {
  width: 100%;
}

.main-header {
  width: 100%;
  padding: 0 0 0 0;
  margin-bottom: 2px;
}
</style>
