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
    <el-main>
      <el-collapse v-for="category in Categories" :key="category.nameCat">
        <el-collapse-item :name="category.name">
        <b slot="title">
        <!-- <el-tooltip :content="`Remove category ${category}`">
          <el-button
            icon="el-icon-minus"
            circle
            @click.native="delCategory(category)"
          ></el-button>
        </el-tooltip> -->
        {{ category.name }}
        </b>
          <el-table :data="category.attributes">
            <el-table-column label="Name">
              <el-input
                slot-scope="scope"
                size="small"
                v-model="scope.row.new_label"
                :placeholder="scope.row.new_label"
                :disabled="!scope.row.isEditing">
              </el-input>
            </el-table-column>
            <el-table-column label="Value">
              <el-input
                slot-scope="scope"
                size="small"
                v-model="scope.row.new_value"
                :placeholder="scope.row.new_value"
                :disabled="!scope.row.isEditing">
              </el-input>
            </el-table-column>
            <el-table-column fixed="right" label="Options" width="120">
              <template slot-scope="scope">
                <el-tooltip :content="`Remove attribute ${scope.row.label}`">
                  <el-button
                    icon="el-icon-minus"
                    circle
                    @click.native="delAttribute(category, scope.row.label)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip :content="`Edit attribute ${scope.row.label}`">
                  <el-button
                    icon="el-icon-edit"
                    circle
                    @click.native="editAttribute(category, scope.row)"
                  ></el-button>
                </el-tooltip>
              <template>
            </el-table-column>
          </el-table>
          <el-tooltip :content="`Add attribute to ${category.name}`">
            <el-button
              icon="el-icon-plus"
              circle
              @click.native="addAttribute(category)"
            ></el-button>
          </el-tooltip>
        </el-collapse-item>
      </el-collapse>
      <el-tooltip :content="`Add attribute category`">
        <el-button
          icon="el-icon-plus"
          circle
          :disabled="ctxNode == false"
          @click.native="addCategory()"
        ></el-button>
      </el-tooltip>
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
  name: "Attributes",
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
          await this.update(newProp.view.serverId);
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
        }
        else
        {
          this.Categories = false;
          this.ctxNode = false;
        }
      },
      deep: true,
      // immediate: true,
    }
  },
  methods: {
    async update(id)
    {
      console.debug("start");
      this.ctxNode = FileSystem._objects[id];
      serviceDocumentation.getCategory(this.ctxNode).then((Categories) => {
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
                value: attribute.value._data,
                isEditing: false,
                new_label: attribute.label._data,
                new_value: attribute.value._data,
                });
            }
            let cat = {
              cat: category,
              name: category.nameCat,
              attributes: attrs,
            }
            this.Categories.push(cat);
          })
        }
      })
      console.debug("Wait ...", this.Categories);
      console.debug("end");
    },
    exportToExcel() {
      this.$refs["Explorer-table"].exportToExcel();
    },
    async getAttributes(category)
    {
      let result = await serviceDocumentation.getAttributesByCategory(this.ctxNode, category.nameCat);
      return result;
    },
    async addAttribute(category){
      await serviceDocumentation.addAttributeByCategoryName(this.ctxNode, category.name, "newAttribute", "newValue", "", "");
      category.attributes.push({
                label: "newAttribute",
                value: "newValue",
                isEditing: false,
                new_label: "newAttribute",
                new_value: "newValue",
                })
    },
    async addCategory(){
      const category = await serviceDocumentation.addCategoryAttribute(this.ctxNode, "NewCategory");
      this.Categories.push({
          cat: category,
          name: "NewCategory",
          attributes: [],
        })
    },
    async delAttribute(category, attribute){
      await serviceDocumentation.removeAttributesByLabel(category.cat.node, attribute)
      category.attributes = category.attributes.filter(attr => !(attr.label == attribute))
    },
    async delCategory(category){
      console.debug("wat ?", category)
      await serviceDocumentation.delCategoryAttribute(this.ctxNode, category.name)
      this.Categories = this.Categories.filter(cat => !(cat.label == category.name))
    },
    async editAttribute(category, attribute){
      if (!attribute.isEditing)
      {
        attribute.isEditing = true;
        return;
      }
      await serviceDocumentation.setAttribute(this.ctxNode, attribute.label, attribute.value, attribute.new_label, attribute.new_value);
      attribute.isEditing = false;
    },
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>
