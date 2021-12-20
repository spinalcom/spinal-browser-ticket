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
  <div class="applist-main-container">
    <div class="app-list-header">Application List <el-button
                 icon="el-icon-s-grid"
                 circle
                 @click="openDrawer"></el-button>
    </div>
    <div class="applist-container spinal-scrollbar">
      <router-link v-for="route in routes"
                   :key="route.path"
                   v-ripple
                   :index="route.name"
                   :to="route.path"
                   class="router-link-btn">
        <el-card :body-style="{ padding: '0px' }"
                 shadow="always">
          <!-- <div class="app-item-image-container">
            <svg class="app-item-image"></svg>
          </div> -->
          <div class="app-item-text">
            <span>{{ $t('Routes.' + route.name) }}</span>
          </div>
        </el-card>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { routes } from "../router";
import { EventBus } from "../../services/event";
export default {
  name: "AppList",
  data() {
    return {};
  },
  computed: {
    routes() {
      return routes.filter(e => !e.redirect && this.$route.name !== e.name);
      // return routes;
    }
  },
  methods: {
    menuSelect(index) {
      if (this.$route.name !== index) {
        this.$router.push({
          name: index
        });
      }
    },
    openDrawer() {
      EventBus.$emit("open-drawer");
    }
  }
};
</script>

<style scoped>
.applist-main-container {
  background-color: #fdfdfd;
  padding: 0;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.applist-main-container > * {
  margin: 5px;
  position: relative;
  background-color: white;
}
.app-list-header {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.router-link-btn {
  text-decoration-color: unset;
  text-decoration-line: unset;
}

.applist-container {
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 68px);
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  position: relative;
  justify-content: space-around;
}
.applist-container > * {
  width: 30%;
  align-self: center;
  /* flex-grow: 1; */
  cursor: pointer;
}
.applist-container > * > * {
  background-color: #dcdfe6;
  height: 100px;
  color: black;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.applist-container > *:hover > * {
  background-color: #6290c8;
}

.app-item-text {
  padding: 14px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 992px) {
  .applist-container > * {
    width: 47%;
  }
}
@media screen and (max-width: 567px) {
  .applist-container > * {
    width: 100%;
  }
}
.app-item-image-container {
  height: 20vmin;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.app-item-image {
  align-self: center;
  width: 100%;
  height: 20vmin;
  background-color: #3646b1;
  background-image: radial-gradient(circle at bottom, #3646b1, #1d3461);
}
</style>
