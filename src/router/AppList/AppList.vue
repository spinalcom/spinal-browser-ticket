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
    <div class="applist-container">
      <router-link v-for="route in routes"
                   :key="route.path"
                   v-ripple
                   :index="route.name"
                   :to="route.path"
                   class="router-link-btn">
        <el-card :body-style="{ padding: '0px' }"
                 shadow="always">
          <div class="app-item-image-container">
            <svg class="app-item-image"></svg>
          </div>
          <div class="app-item-text">
            <span>{{ route.name }}</span>
          </div>
        </el-card>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { routes } from "../router";
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
    }
  }
};
</script>

<style scoped>
.applist-main-container {
  background-color: white;
  padding: 16px;
  width: 100%;
}
.router-link-btn {
  text-decoration-color: unset;
  text-decoration-line: unset;
}
.applist-container {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
  justify-content: space-around;
}
.applist-container > * {
  width: 30%;
  align-self: center;
  flex-grow: 1;
  cursor: pointer;
}
.applist-container > * > * {
  background-color: #1d3461;
  color: white;
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
