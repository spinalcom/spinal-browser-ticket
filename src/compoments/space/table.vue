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
  <div class="spacecon">
    <div class="root"
         v-if="selectCategorie == null">

      <el-card class="box-card"
               v-for="context in contextLst"
               :key=context.id>

        <div slot="header"
             class="clearfix">
          <span>{{context.name}}</span>
        </div>
        <div class="card-content">
          <el-button v-for="contextCat in context.categories"
                     :key=contextCat.id
                     @click="onclick(contextCat)">
            {{contextCat.name}}
          </el-button>
        </div>
      </el-card>
    </div>
    <div v-else>
      <el-button @click="onclick(null)">BACK
      </el-button>
      <categoryLstVue :selectCategorie="selectCategorie"></categoryLstVue>
    </div>

  </div>
</template>

<script>
import SpinalBackend, { spinalBackEnd } from "../../services/spinalBackend";
import categoryLstVue from "./component/categoryLstVue";

export default {
  components: { categoryLstVue },
  props: [],
  methods: {
    onclick(categorie) {
      this.selectCategorie = categorie;
    }
  },
  data() {
    return {
      contextLst: [],
      selectCategorie: null
    };
  },
  async mounted() {
    this.contextLst = await spinalBackEnd.spaceBack.getData();
  }
};
</script>

<style scoped>
.spacecon {
  width: 100%;
}
.card-content {
  display: flex;
  flex-direction: column;
}
.card-content > * {
  margin-left: 0;
  margin-top: 10px;
}
.clearfix {
  text-align: center;
}
</style>
