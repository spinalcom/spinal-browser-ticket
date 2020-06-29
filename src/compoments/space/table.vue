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

    <el-breadcrumb class="breadcrumb-style"
                   separator="/">
      <el-breadcrumb-item><a @click="onclick(null)">Space Management</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs"
                          :key="index"><a
           @click="breadcrumb.click">{{breadcrumb.name}}</a>
      </el-breadcrumb-item>

    </el-breadcrumb>

    <div class="root"
         v-if="selectCategorie == null">

      <!-- <el-card class="box-card"
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
      </el-card> -->

      <tableau-context v-if="contextSelected === null"
                       :contextLst="contextLst"
                       @select="SelectContext">
      </tableau-context>

      <tableau-category v-else
                        :contextSelected="contextSelected"
                        @seeGroups="onclick"></tableau-category>

    </div>

    <div v-else>
      <!-- <el-button class="back-icon"
                 @click="onclick(null)"
                 icon="el-icon-back"></el-button> -->
      <!-- <el-button @click="onclick(null)">BACK
      </el-button> -->

      <categoryLstVue :selectCategorie="selectCategorie"
                      @addbreadcrumb="addbreadcrumb"
                      ref="categoryListe"></categoryLstVue>
    </div>

  </div>
</template>

<script>
import SpinalBackend, { spinalBackEnd } from "../../services/spinalBackend";
import categoryLstVue from "./component/categoryLstVue";
import tableauContext from "./tableaucontext";
import tableauCategory from "./tableaucategory";

export default {
  components: { categoryLstVue, tableauContext, tableauCategory },
  props: [],
  methods: {
    onclick(categorie) {
      this.selectCategorie = categorie;
      // this.breadcrumbs = [];
      if (categorie) {
        const categorieIndex = 1;
        this.breadcrumbs.splice(categorieIndex);

        this.breadcrumbs = [
          ...this.breadcrumbs,
          {
            name: categorie.name,
            click: () => {
              this.onclick(categorie);
              this.$refs.categoryListe.resetRoomSelected();
            }
          }
        ];
      } else {
        this.contextSelected = null;
        this.breadcrumbs = [];
      }
    },

    addbreadcrumb(resultat) {
      console.log("appelle de add breadcrubm");
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    SelectContext(context) {
      this.breadcrumbs = [];
      this.selectCategorie = null;
      this.contextSelected = context;

      const obj = {
        name: context.name,
        click: () => {
          this.SelectContext(context);
        }
      };

      this.breadcrumbs = [...this.breadcrumbs, obj];
      this.contextSelected = context;
    }
  },
  data() {
    return {
      contextLst: [],
      selectCategorie: null,
      breadcrumbs: [],
      contextSelected: null
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
  padding: 0 10px;
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
.breadcrumb-style {
  font-size: 20px;
  margin: 15px 0 20px 2px;
}
</style>
