<template>
  <div>
    <el-button-group class="lang-selector-grp">
      <el-button v-for="lang in langs"
                 :key="lang"
                 type="primary"
                 :disabled="currentLang === lang"
                 @click="setLang(lang)">{{toLocaleUpperCase(lang)}}
      </el-button>
    </el-button-group>
  </div>
</template>
<script>
import {
  getDefaultLanguage,
  loadLanguageAsync
} from "./../../../services/i18n";
export default {
  data() {
    return { currentLang: "", langs: ["en", "fr"] };
  },
  name: "langSelector",
  created() {
    getDefaultLanguage().then(lang => {
      this.currentLang = lang;
    });
  },
  methods: {
    toLocaleUpperCase(str) {
      return str.toLocaleUpperCase();
    },
    setLang(lang) {
      loadLanguageAsync(lang);
      this.currentLang = lang;
    }
  }
};
</script>

<style>
.lang-selector-grp {
  align-self: center;
}
</style>
