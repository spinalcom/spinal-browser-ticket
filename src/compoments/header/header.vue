<template>
  <div class="spinal-header-container">
    <img class="spinal-header-logo"
         src="../../assets/imgs/spinalcom-logo.png"
         alt="spinalcom-logo">
    <div>
      <h4>title</h4>
    </div>
    <el-button-group class="lang-selector-grp">
      <el-button v-for="lang in langs"
                 :key="lang"
                 type="primary"
                 :disabled="currentLang === lang"
                 @click="setLang(lang)">{{lang}}</el-button>
    </el-button-group>
  </div>
</template>


<script>
import { getDefaultLanguage, loadLanguageAsync } from "./../../services/i18n";
export default {
  name: "spinal-header",
  data() {
    return {
      currentLang: "",
      langs: ["en", "fr"]
    };
  },
  created() {
    getDefaultLanguage().then(lang => {
      this.currentLang = lang;
    });
  },
  methods: {
    setLang(lang) {
      loadLanguageAsync(lang);
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

.spinal-header-container > * {
  display: flex;
  align-self: center;
}
.lang-selector-grp {
  padding-right: 8px;
}
</style>
