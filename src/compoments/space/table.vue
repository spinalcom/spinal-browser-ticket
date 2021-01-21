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
      <el-breadcrumb-item>
        <a @click="onclick(null)">Space Management</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs"
                          :key="index">
        <a @click="breadcrumb.click">{{ breadcrumb.name }}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="spacecon_container"
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
                       :context-lst="contextLst"
                       @select="SelectContext">
      </tableau-context>

      <tableau-category v-else
                        :context-selected="contextSelected"
                        @seeGroups="onclick"></tableau-category>
    </div>

    <div class="spacecon_container"
         v-else>
      <!-- <el-button class="back-icon"
                 @click="onclick(null)"
                 icon="el-icon-back"></el-button> -->
      <!-- <el-button @click="onclick(null)">BACK
      </el-button> -->
      <room-data v-if="roomNodeId"
                 :node-id="roomNodeId"></room-data>

      <categoryLstVue v-show="!roomNodeId"
                      ref="categoryListe"
                      :select-categorie="selectCategorie"
                      @addbreadcrumb="addbreadcrumb"
                      @updateBreadcrumb="removeAndAddBreadcrumb"
                      @resetRoomSelect="roomNodeId = null">
      </categoryLstVue>
    </div>
  </div>
</template>

<script>
import { spinalBackEnd } from "../../services/spinalBackend";
import categoryLstVue from "./component/categoryLstVue";
import tableauContext from "./tableaucontext";
import tableauCategory from "./tableaucategory";
// import { roomLstVue } from "../space/component/roomLstVue";
import RoomData from "./component/RoomData.vue";

import { EventBus } from "../../services/event";

export default {
  components: {
    categoryLstVue,
    tableauContext,
    tableauCategory,
    "room-data": RoomData
  },
  props: [],
  data() {
    return {
      contextLst: [],
      selectCategorie: null,
      roomNodeId: null,
      breadcrumbs: [],
      contextSelected: null
    };
  },
  async mounted() {
    this.contextLst = await spinalBackEnd.spaceBack.getData();

    EventBus.$on("sidebar-selected-item", item => {
      spinalBackEnd.spaceBack
        .getDataFilterItem(item)
        .then(result => {
          console.log("resuuuuuuuultat____", result);
          this.contextLst = result;

          if (this.contextSelected) {
            for (const context of this.contextLst) {
              if (this.contextSelected.id === context.id) {
                const selectCategorie = this.selectCategorie;
                this.SelectContext(context, false);
                if (selectCategorie) {
                  for (const cat of this.contextSelected.categories) {
                    if (selectCategorie.id === cat.id) {
                      this.onclick(cat, false);
                      // this.selectCategorie = categorie;
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
    onclick(categorie, changepage = true) {
      this.selectCategorie = categorie;
      // this.breadcrumbs = [];
      if (categorie && changepage) {
        this.removeAndAddBreadcrumb({
          index: 1,
          item: {
            name: categorie.name,
            click: () => {
              const realCategory = this.contextSelected.categories.find(
                el => el.id === categorie.id
              );
              this.onclick(realCategory);
              this.roomNodeId = null;
              this.$refs.categoryListe.resetRoomSelected();
            }
          }
        });
      } else if (changepage) {
        this.contextSelected = null;
        this.roomNodeId = null;
        this.breadcrumbs = [];
      }
    },

    addbreadcrumb(resultat) {
      console.log("appelle de add breadcrubm");
      if (typeof resultat.roomNodeId !== "undefined") {
        this.roomNodeId = resultat.roomNodeId;
      }
      this.breadcrumbs = [...this.breadcrumbs, resultat];
    },

    SelectContext(context, changepage = true) {
      this.contextSelected = context;

      if (changepage) {
        this.selectCategorie = null;
        this.breadcrumbs = [];
        const obj = {
          name: context.name,
          click: () => {
            const another = this.contextLst.find(el => el.id === context.id);
            this.roomNodeId = null;
            this.SelectContext(another);
          }
        };

        this.breadcrumbs = [...this.breadcrumbs, obj];
      }

      // this.contextSelected = context;
    },

    removeAndAddBreadcrumb(data) {
      console.log(data);
      this.roomNodeId = null;
      this.breadcrumbs.splice(data.index);

      this.breadcrumbs = [...this.breadcrumbs, data.item];
    }
  }
};
</script>

<style scoped>
.spacecon {
  width: 100%;
  height: 100%;
}
/* .card-content {
  display: flex;
  flex-direction: column;
}
.card-content > * {
  margin-left: 0;
  margin-top: 10px;
}
.clearfix {
  text-align: center;
} */

.spacecon .breadcrumb-style {
  width: 100%;
  height: 60px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 5px 0 5px;
}

.spacecon .spacecon_container {
  width: 100%;
  height: calc(100% - 70px);
  max-height: calc(100% - 70px);
  /* overflow: auto; */
}

/* .boutton-barre {
  padding: 14px !important;
}
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
} */
</style>
