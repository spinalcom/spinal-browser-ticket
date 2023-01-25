<!--
Copyright 2018 SpinalCom - www.spinalcom.com

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
  <div class="inventory-panel">
    <div class="inventory-panel-button-group">
      <md-button
        style="background: red"
        class="inventory-panel-button-close"
        @click="openInventoryModal"
        >{{ $t("node-type.close-chart") }}
      </md-button>
    </div>

    <div class="inventory-title">{{"Inventaire sur " + tableData.node}}
      </div>

    <div class="inventory-resume">
      <v-list-item
        class="inventory-resume-item"
        v-for="(item, index) in tableData.resume"
        :key="item"
      >
        <v-list-item-content>
          <v-list-item-title class="inventory-resume-content">
            <div class="inventory-resume-content-value">
              {{ item[0] + " / " + item[1] }}
              <!-- <div>{{ item[0] }}</div>
              <div :style="{'display':'flex', 'flex-direction': 'row'}">
                <div>{{ item[1] }}</div>
              </div> -->
            </div>
            <div class="inventory-resume-content-unit">{{tableData.resumeUnit}}</div>
            <div class="inventory-resume-content-name">{{ index }}</div>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div class="inventory-panel-table-div">
      <el-table
        class="inventory-panel-table"
        :cell-class-name="cellClassChecker"
        table-layout='fixed'
        height="100%"
        max-height="60vh"
        :data="tableData.array"
        border
        resizable
        :header-cell-style="{
          'background-color': '#ffffff',
          'letter-spacing': '1px',
          'color': '#214353',
          'opacity': '1',
          'height': 'fit-content',
          'text-align-last': 'center',
        }"
        :row-style="{
          'background': '#ffffff 0% 0% no-repeat padding-box',
          'opacity': '1',
          'text-align-last': 'center',
          'letter-spacing': '0.9px',
          'color': '#214353',
          'opacity': '1',
        }"
      >
        <!-- <el-table-column
          class="inventory-panel-table-columns"
          v-for="head in tableData.headers"
          :key="head"
          :prop="head"
          :label="head"
          sortable
          :fixed="(head==tableData.headers[0] || head==tableData.headers[1])"
          :width="(head==tableData.headers[0])? '250px':'100px'"
        > -->
        <el-table-column
          class="inventory-panel-table-columns"
          v-for="head in tableData.headers"
          :key="head"
          :prop="head"
          :label="head"
          sortable
          :fixed="(head==tableData.headers[0] || head==tableData.headers[1])"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "InventoryPanel",
  components: {},
  props: ["isInventoryModalVisible", "openInventoryModal"],
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    async toogleSelect(data) {
      this.tableData = data;
      // console.log(data);
    },
    cellClassChecker(e){
      if(e.row[e.column.property] == undefined) return "inventory-panel-table-cell-empty";
    }
  },
};
</script>

<style>
.inventory-panel {
  background-color: #fafafa;
}
.inventory-panel-button-group {
  display: flex;
  justify-content: flex-end;
  height: 60px;
}
.inventory-panel-button-close {
  width: fit-content;
}
.inventory-title {
  text-align: left;
  color: #58727e;
  letter-spacing: 1.4px;
  font-size: 30px;
  font-weight: 200;
  /* margin-top: 10px; */
  margin-top: 2%;
  margin-left: 5%;
  margin-bottom: 1%;
  /* margin-left: 5%; */
}
/* .inventory-title-1{
  color: #58727e;
}
.inventory-title-2{
  color: #14202c;
} */

.inventory-resume {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
/* .inventory-resume-item{

} */

.inventory-resume-content {
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  /* justify-content: flex-start; */
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  height: fit-content;
  border: 2px solid #eaeef0;
  border-radius: 17px;
  margin: 0px 5px 10px 5px;
  width: fit-content;
}

.inventory-resume-content-value {
  letter-spacing: 1.5px;
  color: #14202c;
  opacity: 1;
  font-size: 20px;
  text-align: center;
  padding: 5px 0px 5px 5px;
}
.inventory-resume-content-unit{
  /* margin-left: 2px; */
  letter-spacing: 1.2px;
  color: #14202c;
  opacity: 1;
  font-size: 15px;
}

.inventory-resume-content-name {
  color: #58727e;
  /* letter-spacing: 1px;
  font-size: 16px;
  font-weight: 200; */
  letter-spacing: 1.2px;
  opacity: 1;
  font-size: 15px;
  text-align: center;
  margin-left: 2px;
  /* color: #949da6;
  letter-spacing: 1.1px;
  font-size: 15px; */
  /* margin-left: 6px; */
}
.inventory-panel-table-div {
  margin-right: 5%;
  margin-left: 5%;
  /* overflow:auto; */
}
.inventory-panel-table {
  /* text-align: center; */
  text-align-last: left;
  /* width: max-content; */
  /* overflow: scroll; */
  /* max-height: 70vh; */
  /* margin: 10px; */
}
.inventory-panel{
  overflow: auto;
}
.inventory-panel-table-cell-empty{
  /* background-color: #EAEEF0; */
  background-color: #F4F4F4;
}
</style>

