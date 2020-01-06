<template>
  <el-container class="body-container"
                v-loading="loading">
    <el-header class="main-header">
      <spinal-header></spinal-header>
    </el-header>
    <spinalNavbar class="main-navbar"></spinalNavbar>
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
import spinalNavbar from "./compoments/navbar/spinalNavbar";
import mainContent from "./compoments/mainContent/index";
import { errorDialog } from "./services/utlils/errorDialog";

export default Vue.extend({
  data() {
    return {
      loading: true
    };
  },
  components: {
    "spinal-header": spinalHeader,
    "spinal-side-bar": spinalSideBar,
    mainContent,
    spinalNavbar
  },
  async mounted() {
    try {
      await spinalBackEnd.getGraph();
      this.loading = false;
    } catch (e) {
      console.error(e);
      console.log(this.$t("error.returntodrive.confirmbtntext"));
      const title = this.$t("error.returntodrive.title");
      const comfimText = this.$t("error.returntodrive.confirmbtntext");
      const msg = this.$t("error.returntodrive.text");
      errorDialog.call(this, title, comfimText, msg, e);
      // this.$alert(`${e}`, 'Error', {
      //           confirmButtonText: 'Retrun to drive',
      //           callback: action => {
      //           }
      //         });
    }
  },
  methods: {}
});
</script>

<style scoped>
.body-container {
  height: 100%;
  width: 100%;
  display: flex;
}
.body-main-container {
  height: calc(100% - 62px);
  display: flex;
  position: relative;
}
.side-bar-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  width: 201px;
  overflow: hidden;
  height: 100%;
  position: relative;
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
.main-navbar {
  display: none;
}

@media screen and (max-width: 992px) {
  .side-bar-container {
    display: none;
  }
  .main-navbar {
    display: flex;
  }
}
</style>
