<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->

<template>
  <el-container v-loading="loading"
                class="body-container">
    <!-- <el-header class="main-header">
      <spinal-header></spinal-header>
    </el-header> -->
    <!-- <spinalNavbar class="main-navbar"></spinalNavbar> -->
    <div class="body-main-container">
      <!-- <el-aside width="201px"
                class="side-bar-container">
                <spinal-side-bar></spinal-side-bar>
      </el-aside> -->
      <mainContent></mainContent>
    </div>
    <el-drawer class="spinal-drawer"
               :visible.sync="drawer"
               :with-header="false">
      <drawer @close="drawer = false"></drawer>
    </el-drawer>
  </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import spinalHeader from "./compoments/header/header.vue";
// import spinalSideBar from "./compoments/sidebar/sidebar.vue";
import spinalBackEnd from "./services/spinalBackend";
// import spinalNavbar from "./compoments/navbar/spinalNavbar.vue";
import mainContent from "./compoments/mainContent/index.vue";
// import { errorDialog } from "./services/utlils/errorDialog";
import DocumentReady from "./services/utlils/DocumentReady";
import { getDefaultLanguage } from "./services/i18n";
import drawer from "./compoments/drawer/drawer.vue";
import {EventBus} from "./services/event";

export default Vue.extend({
  components: {
    "spinal-header": spinalHeader,
    // "spinal-side-bar": spinalSideBar,
    mainContent,
    drawer
  },
  data() {
    return {
      loading: true,
      drawer: false
    };
  },
  async mounted() {
    try {
      await spinalBackEnd.getGraph();
      this.loading = false;
      EventBus.$on("open-drawer", () => {
        this.drawer = true;
      });
    } catch (e) {
      DocumentReady(async () => {
        await getDefaultLanguage();
        console.error(e);
        // @ts-ignore
        window.location =
          "/html/spinaltwin/login.html" + location.hash + location.search;
        // console.log(this.$t("error.returntodrive.confirmbtntext"));
        // const title = this.$t("error.returntodrive.title");
        // const comfimText = this.$t("error.returntodrive.confirmbtntext");
        // const msg = this.$t("error.returntodrive.text");
        // errorDialog.call(this, title, comfimText, msg, e);
      });
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
  min-height: 0;
  flex-grow: 1;
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
  display: flex;
  /* display: none; */
}

@media screen and (max-width: 992px) {
  /* .side-bar-container {
    display: none;
  } */
  .main-navbar {
    display: flex;
  }
}
</style>
