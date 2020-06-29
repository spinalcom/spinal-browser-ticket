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
  <el-table :data="items"
            border
            style="width: 100%"
            header-cell-style="background-color: #f0f2f5;"
            @row-click="SeeEvent">
    <el-table-column prop="name"
                     label="Nom">
    </el-table-column>

    <el-table-column prop="rooms.length"
                     label="Nombre de pièces"
                     align="center">
    </el-table-column>
    <!-- true -->

    <el-table-column prop="surface"
                     label="Surface"
                     align="center">
      <template slot-scope="scope">
        {{ scope.row.surface }} m²
      </template>
    </el-table-column>

    <el-table-column prop="color"
                     label="Couleur"
                     align="center">
      <template slot-scope="scope">
        <div :style="{'background-color': scope.row.color}"
             class="couleur"
             style="width: 30%; height: 30px; margin: auto;">
        </div>
      </template>
    </el-table-column>

    <el-table-column label="Liste de pièces"
                     align="center">
      <template slot-scope="scope">
        <el-button icon="el-icon-top-right"
                   @click="seeRoomTable(scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "InventoryTable",
  data() {
    return {

    };
  }
};
</script>
