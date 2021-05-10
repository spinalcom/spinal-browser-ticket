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
<el-row>
    <el-tabs type="border-card">
      <!-- Onglet Tableau -->
      <el-tab-pane label="Tableau">

        <el-button class="boutton-barre"
               icon="el-icon-arrow-left"
               circle
               style ="position: fixed; z-index: 1;"
               @click="goBack()"></el-button>

        <el-row class="barre">
          <el-button class="boutton-barre"
                     icon="el-icon-download"
                     circle
                     ></el-button>
          <el-button class="boutton-barre"
                     icon="el-icon-view"
                     circle
                     ></el-button>

        </el-row> 
    <!-- On récupère la data à partir de props -->
    <el-table 
              :data="profils" 
              class="tab"
              border
              style="width: 100%"
              :header-cell-style='{"background-color": "#f0f2f5"}'
              @row-click="SeeEvent">

      <el-table-column prop=name
                       label="Profil"
                       align="center">
      </el-table-column>

      <el-table-column width="65"
                       align="center">
          <template slot-scope="scope">
              <el-button v-on:click="SelectProfil(scope.row)"
                         icon="el-icon-arrow-right"
                         circle></el-button>
          </template>
      </el-table-column>
    </el-table>
    </el-tab-pane>
    </el-tabs>

  </el-row>

</template>

<script>
export default {
  data() {
    return {
      //contextLst: []
    };
  },
  components: {},
  props: ["profils", "color"],
  methods: {
    SeeEvent(data) {
      this.$emit("seeEvent", { ...data, color: this.color });
    },
    goBack(){
      this.$emit("goBackGroup");
    },
    seeHeatmap:function(info){
      this.$emit('profilSelectEvent', info);
    },
    SelectProfil(profil){
      this.$emit("selectprofil",profil)
    }
  },


  
  async mounted() {
  },
  watch: {},
  beforeDestroy() {

  }
};
</script>

<style scoped>
.butcen {
  text-align: center;
  padding-top: 100px;
}

.boutton-barre {
  padding: 14px !important;
}
.barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.el-icon-download {
  width: 30px;
}

.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>