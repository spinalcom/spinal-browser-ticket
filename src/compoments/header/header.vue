<template>
  <div class="spinal-header-container">
    <img class="spinal-header-logo"
         src="../../assets/imgs/spinalcom-logo.png"
         alt="spinalcom-logo">
    <div class="menu-icon-header-container"
         @click="drawer = true">
      <i data-eva="keypad-outline"
         data-eva-animation="zoom"
         data-eva-height="24"
         data-eva-width="24"></i>
    </div>
    <el-drawer title="I am the title"
               :visible.sync="drawer"
               :with-header="false">
      <drawer @close="drawer = false"></drawer>
    </el-drawer>

  </div>
</template>


<script>
import { getDefaultLanguage, loadLanguageAsync } from "./../../services/i18n";
import * as eva from "eva-icons";
import drawer from "../drawer/drawer.vue";
export default {
  name: "spinal-header",
  components: { drawer },
  data() {
    return {
      drawer: false
    };
  },
  created() {
    getDefaultLanguage().then(lang => {
      this.currentLang = lang;
    });
  },
  mounted() {
    eva.replace();
  },
  methods: {
    toLocaleLowerCase(str) {
      return str.toLocaleLowerCase();
    },
    setLang(lang) {
      loadLanguageAsync(lang.toLocaleLowerCase());
      this.currentLang = lang;
    }
  }
};
</script>

<style  scoped>
.spinal-header-container {
  height: 60px;
  display: flex;
  align-self: auto;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.spinal-header-logo {
  align-self: auto;
  height: 55px;
}

.menu-icon-header-container > i {
  line-height: 0px;
}
.menu-icon-header-container {
  height: 24px;
  cursor: pointer;
  padding-right: 8px;
}

.spinal-header-container > * {
  display: flex;
  align-self: center;
}
</style>
