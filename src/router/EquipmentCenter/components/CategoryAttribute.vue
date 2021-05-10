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
  <el-container>
    <!-- <el-header>
      <el-button
        icon="el-icon-plus"
        style="float: right"
        circle
        @click.stop="debug(Categories)"
      >
      </el-button>
    </el-header> -->
    <el-main v-if="Categories !== false">
      <el-collapse v-for="category in Categories" :key="category.nameCat">
        <el-collapse-item :name="category.name">
        <template slot="title">
        {{ category.name }}
        </template>
          <el-table :data="category.attributes">
            <el-table-column label="Name" prop="label">
            </el-table-column>
            <el-table-column label="Value" prop="value">
            </el-table-column>
          </el-table>
        <!-- <el-button
          icon="el-icon-plus"
          style="margin-right:50px"
          circle
          @click.native="addAttribute(category)"
        ></el-button> -->
        </el-collapse-item>
      </el-collapse>
    </el-main>
  </el-container>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
// import { spinalBackEnd } from "../../../services/spinalBackend";
import { EquipmentBack } from "../backend/EquipmentBack";
import BackendInitializer from "../../../services/BackendInitializer";
import { EventBus } from "../../../services/event";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service"
import { FileSystem } from 'spinal-core-connectorjs_type'
import "../../../services/EventHandler";

import NodeTable from "./NodeTable.vue";
export default {
  name: "Explorer",
  components: { NodeTable },
  props: {
    Properties: {
      required: true,
      type: Object,
      validator: function(value) {
        if (value.viewKey == "") {
          return "danger";
        }
        return "success";
      },
    },
  },
  data() {
    return {
      ctxNode: false,
      Categories: false,
    };
  },
  watch:
  {
    Properties:
    {
      handler: async function(oldProp, newProp)
      {
        if (newProp.view.serverId != 0)
        {
          // console.debug("start");
          // this.ctxNode = FileSystem._objects[newProp.view.serverId];
          // let Categories = await serviceDocumentation.getCategory(this.ctxNode);
          // this.Categories = [];
          // for(const category of Categories)
          // {
          //   let attributes = await serviceDocumentation.getAttributesByCategory(this.ctxNode, category.nameCat);
          //   let attrs = [];
          //   for (const attribute of attributes)
          //   {
          //     attrs.push({
          //       label: attribute.label._data,
          //       value: attribute.value._data
          //       });
          //   }
          //   let cat = {
          //     name: category.nameCat,
          //     attributes: attrs
          //   }
          //   this.Categories.push(cat);
          // }
          // console.debug("Wait ...", this.Categories);
          // console.debug("end");
          console.debug("start");
          this.ctxNode = await FileSystem._objects[newProp.view.serverId];
          console.debug("File system :", FileSystem)
          serviceDocumentation.getCategory(this.ctxNode).then((Categories) => {
            console.debug("test");
            this.Categories = [];
            for(const category of Categories)
            {
              serviceDocumentation.getAttributesByCategory(this.ctxNode, category.nameCat).then((attributes) =>
              {
                let attrs = [];
                for (const attribute of attributes)
                {
                  attrs.push({
                    label: attribute.label._data,
                    value: attribute.value._data
                    });
                }
                let cat = {
                  name: category.nameCat,
                  attributes: attrs
                }
                this.Categories.push(cat);
              })
            }
          })
          console.debug("Wait ...", this.Categories);
          console.debug("end");
        }
      },
      deep: true,
      // immediate: true,
    }
  },
  methods: {
    exportToExcel() {
      this.$refs["Explorer-table"].exportToExcel();
    },
    async getAttributes(category)
    {
      let result = await serviceDocumentation.getAttributesByCategory(this.ctxNode, category.nameCat);
      console.debug("result : ", result[0]["value"])
      return result;
    },
    async addAttribute(category){
      console.debug(category)
      await serviceDocumentation.addAttributeByCategoryName(this.ctxNode, category.nameCat, "newAttribute", "newValue", "", "");
    },
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>
