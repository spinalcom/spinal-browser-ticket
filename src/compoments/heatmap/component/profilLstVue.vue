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

      <el-table-column 
          label="GO"
          align="center">
          <template slot-scope="scope">
              <el-button v-on:click="seeHeatmap(scope.row)"
                         icon="el-icon-arrow-right"
                         circle></el-button>
          </template>
      </el-table-column>
    </el-table>

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
    seeHeatmap:function(info){
      this.$emit('profilSelectEvent', info);
    }
  },


  
  async mounted() {
  },
  watch: {},
  beforeDestroy() {

  }
};
</script>