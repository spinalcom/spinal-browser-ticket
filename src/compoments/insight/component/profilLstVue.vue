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
      
      <el-tab-pane :label="$t('Table')">
        <el-button
          class="boutton-barre"
          icon="el-icon-arrow-left"
          circle
          style="position: fixed; z-index: 1"
          @click="goBack()"
        ></el-button>

        <el-row class="barre">
          <el-button
            class="boutton-barre"
            icon="el-icon-download"
            circle
          ></el-button>
          <el-button
            class="boutton-barre"
            icon="el-icon-view"
            circle
            :disabled="true"
          ></el-button>
        </el-row>
        
        <el-table class="tab"
          border
          style="width: 100%"
          :header-cell-style="{ 'background-color': '#f0f2f5' }"
          :data="data"
        >
          <el-table-column align="center" :label="$t('HeatmapCenter.lst_profils')">
            <template slot-scope="scope">
              <div>
                <div
                  class="spinal-table-cell-color"
                  :style="{ 'background-color': scope.row.color }"
                ></div>
                <div> {{ scope.row.name }} </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column width="65" align="center">
            <template slot-scope="scope">
              <el-button
                @click="SelectProfil(scope.row)"
                icon="el-icon-arrow-right"
                circle
              ></el-button>
            </template>
          </el-table-column>



        </el-table>
        
        <!--<el-table-column width="65" align="center">
          <template slot-scope="scope">
            <el-button
              v-on:click="SelectProfil(scope.row)"
              icon="el-icon-arrow-right"
              circle
            ></el-button>
          </template>
        </el-table-column>-->
        
      </el-tab-pane>
    </el-tabs>
  </el-row>
</template>

<script>
import { spinalBackEnd } from '../../../services/spinalBackend';
export default {
  data() {
    return {};
  },
  components: {},
  props: ['profils', 'color'],
  methods: {
    
    SeeEvent(data) {
      this.$emit('seeEvent', { ...data, color: this.color });
    },
    goBack() {
      this.$emit('goBackGroup');
    },
    seeHeatmap: function (info) {
      this.$emit('profilSelectEvent', info);
    },
    async SelectProfil(profil) {
      let itemLinked = await spinalBackEnd.heatmapBack.getElementLinkedToProfil(
        profil
      );
      itemLinked = itemLinked.filter((el) => el); //remove duplicates tagged with undefined
      profil.rooms = itemLinked;
      this.$emit('selectprofil', profil);
    },
  },
  computed: {
    data: function () {
      return this.profils.map((obj) => {
        return {
          id: obj.id,
          name: obj.name,
          endpointsProfils: obj.endpointsProfils
        };
      });
    },
  },
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
