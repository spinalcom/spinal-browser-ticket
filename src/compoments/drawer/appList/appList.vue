<template>
  <div>
    <el-menu class="el-menu-vertical-demo"
             @select="menuSelect"
             :default-active="$route.name">
      <el-menu-item v-for="route in routes"
                    :index="route.name"
                    :key="route.path"
                    :route="route.path">
        <i class="el-icon-document"></i>
        <span>{{route.name}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { routes } from "../../../router/router";
export default {
  data() {
    return {
      routerTrue: true
    };
  },
  name: "appList",
  computed: {
    routes() {
      return routes.filter(e => !e.redirect);
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
