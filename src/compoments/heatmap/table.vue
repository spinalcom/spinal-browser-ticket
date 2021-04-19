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
    <div class="spinal-space-header">
      <div class="spinal-space-header-breadcrum-container spinal-scrollbar">
        <el-breadcrumb class="breadcrumb-style"
                       separator="/">
          <el-breadcrumb-item>
            <a @click="ResetBreadCrumb()">Heatmap Center</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs"
                              :key="index">
            <a @click="breadcrumb.click">{{ breadcrumb.name }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-button icon="el-icon-s-grid"
                 circle
                 @click="openDrawer"></el-button>
    </div>
    <!-- Si on a pas encore choisi de catégorie -->
    <div v-if="selectCategorie == null"
         class="root" style="margin-top:11px;">

      <!-- Si on a pas encore choisi de contexte -->
      <tableau-context v-if="contextSelected == null"
                       :context-lst="contextLst"
                       @select="SelectContext">
      </tableau-context>

      <!-- Si on a choisi un contexte -->
      <tableau-category v-else
                        :context-selected="contextSelected"
                        @seeGroups="SelectCategorie">
      </tableau-category>
    </div>

    <!-- Si on a choisi une catégorie  -->
    <groupLstVue v-if="selectCategorie != null && profilSelected==null && groupSelected ==null"
                 ref="categoryListe"
                 :select-categorie="selectCategorie"
                 @selectgroup="SelectGroup"
                 style="margin-top:11px;">
    </groupLstVue>

    <profilLstVue v-if="groupSelected != null && profilSelected ==null"
                  :profils="groupSelected.profils"
                  :color="groupSelected.color"
                  @selectprofil="SelectProfil"
                  style="margin-top:11px;">
    </profilLstVue>

    <heatmap-vue class="heatmapContainer"
                 v-if="profilSelected!=null"
                 :profil="profilSelected"
                 style="margin-top:11px;">

    </heatmap-vue>

  </div>
</template>

<script>
import { spinalBackEnd } from "../../services/spinalBackend";
import groupLstVue from "./component/groupLstVue";
import profilLstVue from "./component/profilLstVue";
import tableauContext from "./tableaucontext";
import tableauCategory from "./tableaucategory";

import { EventBus } from "../../services/event";
import HeatmapVue from "./component/heatmapVue.vue";

export default {
  components: {
    profilLstVue,
    groupLstVue,
    tableauContext,
    tableauCategory,
    HeatmapVue
  },
  props: [],
  data() {
    return {
      contextLst: [],
      breadcrumbs: [],
      selectCategorie: null,
      contextSelected: null,
      profilSelected: null,
      groupSelected: null
    };
  },
  async mounted() {
    this.profilSelected = null;
    this.contextLst = await spinalBackEnd.heatmapBack.getData(); // this is when we get the data of all the contexts

    EventBus.$on("sidebar-selected-item", item => {
      spinalBackEnd.heatmapBack
        .getDataFilterItem(item)
        .then(result => {
          console.log("resuuuuuuuultat____", result);
          this.contextLst = result;

          if (this.contextSelected) {
            for (const context of this.contextLst) {
              if (this.contextSelected.id === context.id) {
                const selectCategorie = this.selectCategorie;
                this.SelectContext(context);
                if (selectCategorie) {
                  for (const cat of this.contextSelected.categories) {
                    if (selectCategorie.id === cat.id) {
                      this.onclick(cat);
                    }
                  }
                }
                break;
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    });

    EventBus.$on("sidebar-homeSelect", item => {
      console.log("sidebar-homeSelect", item);
    });
  },
  methods: {
    ResetBreadCrumb() {
      this.profilSelected = null;
      this.selectCategorie = null;
      this.contextSelected = null;
      this.groupSelected = null;
      this.breadcrumbs = [];
    },

    addbreadcrumb(resultat) {
      console.log("appelle de add breadcrubm");
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    //choix d'un context (niveau 1)
    SelectContext(context) {
      this.breadcrumbs = [];
      this.selectCategorie = null;
      this.profilSelected = null;
      this.groupSelected = null;
      this.contextSelected = context;

      const obj = {
        name: context.name,
        click: () => {
          this.SelectContext(context);
        }
      };
      this.breadcrumbs = [...this.breadcrumbs, obj];
      this.contextSelected = context;
    },

    //choix d'une catégorie (niveau 2)
    SelectCategorie(categorie) {
      this.groupSelected = null;
      this.profilSelected = null;
      this.selectCategorie = categorie;

      const categorieIndex = 1;
      this.breadcrumbs.splice(categorieIndex);

      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: categorie.name,
          click: () => {
            this.SelectCategorie(categorie);
            //this.$refs.categoryListe.resetRoomSelected();
          }
        }
      ];
    },

    //choix d'une catégorie (niveau 3)
    SelectGroup(group) {
      //on enregistre le groupe choisi
      this.groupSelected = { profils: group.rooms, color: group.color };
      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: group.name,
          click: () => {
            this.profilSelected = null;
            this.groupSelected = null;
            this.breadcrumbs.splice(2);
            this.SelectGroup(group);
          }
        }
      ];
    },

    //choix d'un profil (niveau 4)
    SelectProfil(profil) {
      this.profilSelected = profil;
      this.breadcrumbs = [
        ...this.breadcrumbs,
        {
          name: profil.name,
          click: () => {
            this.profilSelected = null;
            this.breadcrumbs.splice(3);
            this.SelectProfil(profil);
          }
        }
      ];
    },

    addbreadcrumb(resultat) {
      console.log("appelle de add breadcrubm");
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    openDrawer() {
      EventBus.$emit("open-drawer");
    }
  }
};
</script>

<style scoped>
.spacecon {
  width: 100%;
  height: 100%;
  padding: 0 5px;
}
/* .card-content {
   display: flex;
   flex-direction: column;
}
.card-content > * {
   margin-left: 0;
   margin-top: 10px;
} */
/* .clearfix {
   text-align: center;
} */
.breadcrumb-style {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 5px 10px 5px 10px;
  border-radius: 4px;
  align-items: center;
  background-color: white;
}

/* .boutton-barre {
   padding: 14px !important;
} */
/* .barre {
   display: flex;
   justify-content: flex-end;
   margin-bottom: 10px;
} */
.spinal-space-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  background: white;
  margin: 5px 0;
}
.spinal-space-header-breadcrum-container {
  width: calc(100% - 43px);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  height: 100%;
  display: flex;
}

.heatmapContainer {
  width: 100%;
  height: calc(100% - 43px);
}
</style>
