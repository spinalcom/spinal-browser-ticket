<!--
Copyright 2021 SpinalCom - www.spinalcom.com

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
  <el-table
    v-loading="loading"
    :data="data"
    :header-cell-style="{'background-color': '#f0f2f5'}"
    @row-click="selectInView"
    @row-dblclick="SeeEvent"
    border
    style="overflow: auto; height: 100%"
    show-summary
    sum-text="Total"
  >
    <el-table-column :label="$t('explorer.Name')">
      <div slot-scope="scope">
        <div
          v-if="scope.row.color"
          :style="getColor(scope.row.color)"
          class="spinal-table-cell-color"
          ></div>
        <div>
          {{ scope.row.name }}
        </div>
      </div>
    </el-table-column>

    <el-table-column
      v-for="column in columns"
      :key="column"
      :prop="column"
      :label="$t(`node-type.${column}`)"
      align="center"
    >
      <div slot-scope="scope">
        {{ columnValue(scope.row, column) }}
      </div>
    </el-table-column>
    <el-table-column
      v-if="haveChildren"
      :label="$t('node-type.Sum')"
      prop="sum"
      align="center"
    >
      <div slot-scope="scope">
        {{ scope.row.sum }}
      </div>
    </el-table-column>

    <el-table-column
      v-if="haveChildren"
      label=""
      width="65"
      align="center"
      key="isGroup"
    >
      <div slot-scope="scope">
        <el-button
          v-if="scope.row.haveChild"
          @click="onSelectGroup(scope.row)"
          icon="el-icon-arrow-right"
          circle
        ></el-button>
      </div>
    </el-table-column>
    <el-table-column
      v-else
      label=""
      width="65"
      align="center"
      key="isItem"
    >
      <div slot-scope="scope">
        <el-button
          @click="onSelectItem(scope.row)"
          icon="el-icon-search"
          circle
        ></el-button>
      </div>
    </el-table-column>
    <!-- <el-table-column label=""
                      width="65"
                      align="center">
      <div slot-scope="scope">
        <el-button icon="el-icon-arrow-down"
                    @click="debug(scope.row)"></el-button>
                    circle
      </div>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { ViewManager } from "../../../../services/ViewManager/ViewManager";
import { ColorGenerator } from "../../../../services/utlils/ColorGenerator";
import { EventBus } from "../../../../services/event";
import excelManager from "spinal-env-viewer-plugin-excel-manager-service";
import fileSaver from "file-saver";
export default {
  name: "ContextExplorerNodeTable",
  props: {
    viewKey: { required: true, type: String },
    items: { required: true, type: Array },
    columns: { required: true, type: Array },
    relation: { required: true, type: String },
    colored: { required: false, type: Boolean, default: false },
  },

  data() {
    return {
      data: [],
      loading: true,
      loadingArea: true,
      haveChildren: false
    };
  },

  watch: {
    items()
    {
      this.update();
    }
  },

  mounted() {
    this.update();
  },

  methods: {
    selectInView(item) {
      this.$emit("select", { server_id: item.serverId });
    },

    SeeEvent(item) {
      this.$emit("isolate", { server_id: item.serverId });
    },

    Color() {
      EventBus.$emit('viewer-color', this.data, this.relation)
    },

    onSelectItem(item) {
      if (ViewManager.getInstance(this.viewKey).breadcrumb.length >= 5)
        ViewManager.getInstance(this.viewKey).pop()
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
    },

    onSelectGroup(item) {
      ViewManager.getInstance(this.viewKey).push(item.name, item.serverId);
    },

    debug(item) {
      console.debug(item)
    },

    async update() {
      this.loading = true;
      const res = [];
      const colorUsed = [];
      let haveChild = false;
      for (const item of this.items) {
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          color: item.getColor(),
          sum: await item.countItems(),
        };
        if (resItem.color) colorUsed.push(resItem.color);
        if (item.children) {
          for (const [childTypes, childItems] of item.children) {
            resItem[childTypes] = childItems.length;
            resItem.haveChild = true;
            haveChild = true;
          }
        }
        else if (FileSystem._objects[item.serverId] !== undefined) {
          let thisnode = FileSystem._objects[item.serverId]
          if (thisnode.children.PtrLst !== undefined) {
            for (const name of thisnode.children.PtrLst._attribute_names){
              resItem[name] = thisnode.children.PtrLst[name].length;
              resItem.haveChild = true
              this.haveObjects = true
            }
          }
        }
        res.push(resItem);
      }
      this.data = res;
      this.updateColor(this.data, colorUsed);
      this.haveChildren = haveChild;
      this.loading = false;
    },

    updateColor(res, colorUsed) {
      if (colorUsed.length !== this.items.length) {
        const colorGen = new ColorGenerator(this.items.length, colorUsed);
        for (const itm of res) {
          if (itm.color) continue;
          const color = colorGen.getColor();
          this.setColorItem(itm.serverId, color);
          Object.assign(itm, { color });
        }
      }
      EventBus.$emit("viewer-reset-color");
      if (this.colored)
        EventBus.$emit('viewer-color', this.data, this.relation)
    },

    setColorItem(serverId, color) {
      for (const item of this.items) {
        if (item.serverId === serverId) {
          return item.setColor(color);
        }
      }
    },
    
    getColor(color) {
      return { backgroundColor: color[0] === "#" ? color : `#${color}` };
    },

    columnValue(item, key) {
      if (item[key]) return item[key];
      return 0;
    },

    exportToExcel() {
      let headers = [
        {
          key: "name",
          header: this.$t("name"),
          width: 20
        }
      ];
      for (const column of this.columns) {
        headers.push({
          key: column,
          header: this.$t(column),
          width: 10
        });
      }
      let excelData = [
        {
          name: "Tableau",
          author: "",
          data: [
            {
              name: "Tableau",
              header: headers,
              rows: this.data
            }
          ]
        }
      ];
      excelManager.export(excelData).then(reponse => {
        fileSaver.saveAs(new Blob(reponse), `Tableau.xlsx`);
      });
    }
  }
};
</script>

<style scoped>
.spinal-table-cell-color {
  height: 100%;
  width: 5px;
  position: absolute;
  left: 0;
  top: 0;
}
.spl-table {
  height: 800px;
  overflow: auto;
}
.spinal-height-control {
  height: 80%;
}
</style>
