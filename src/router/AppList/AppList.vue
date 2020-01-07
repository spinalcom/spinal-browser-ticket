<template>
  <div class="applist-main-container">
    <div class="applist-container">
      <router-link v-for="route in routes"
                   :index="route.name"
                   :key="route.path"
                   :to="route.path"
                   class="router-link-btn">
        <el-card :body-style="{ padding: '0px' }"
                 shadow="always">
          <div class="app-item-image-container">
            <svg class="app-item-image"></svg>
          </div>
          <div class="app-item-text">
            <span>{{route.name}}</span>
          </div>
        </el-card>
      </router-link>
    </div>
  </div>
</template>

<script>
import { routes } from "../router";
export default {
  data() {
    return {};
  },
  name: "AppList",
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
