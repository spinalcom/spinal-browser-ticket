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
  <div>
    <el-button-group class="lang-selector-grp">
      <el-button
        v-for="lang in langs"
        :key="lang"
        type="primary"
        :disabled="currentLang === lang"
        v-ripple
        @click="setLang(lang)"
        >{{ toLocaleUpperCase(lang) }}
      </el-button>
    </el-button-group>
  </div>
</template>
<script>
import {
  getDefaultLanguage,
  loadLanguageAsync,
} from './../../../services/i18n';
export default {
  data() {
    return { currentLang: '', langs: ['en', 'fr'] };
  },
  name: 'langSelector',
  created() {
    getDefaultLanguage().then((lang) => {
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
    },
  },
};
</script>

<style>
.lang-selector-grp {
  align-self: center;
}
</style>
