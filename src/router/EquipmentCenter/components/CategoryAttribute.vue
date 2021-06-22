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
    </el-header> -->
    <el-main>
      <el-table v-if="Categories" :data="Categories" >
        <el-table-column type=expand>
          <div slot-scope="cat">
            <el-table :data="cat.row.attributes">
              <el-table-column label="Name">
                <editable slot-scope="scope" :content.sync="scope.row.label" :isEditing="scope.row.isEditing">
                  <a v-if="scope.row.type == 'url'" :href="httpify(scope.row.value)">
                    {{ scope.row.label }}
                  </a>
                  <div v-else>
                    {{ scope.row.label }}
                  </div>
                </editable>
              </el-table-column>
              <el-table-column label="Value">
                <editable slot-scope="scope" :content.sync="scope.row.value" :isEditing="scope.row.isEditing">
                  {{ scope.row.value }}
                </editable>
              </el-table-column>
              <el-table-column label="Type">
                <editable slot-scope="scope" :content.sync="scope.row.type" :isEditing="scope.row.isEditing">
                  {{ scope.row.type }}
                  </editable>
              </el-table-column>
              <el-table-column label="Unit">
                <editable slot-scope="scope" :content.sync="scope.row.unit" :isEditing="scope.row.isEditing">
                  {{ scope.row.unit }}
                </editable>
              </el-table-column>
              <el-table-column fixed="right" label="Options" width="120">
                <template slot-scope="scope">
                  <el-tooltip :content="`Edit attribute ${scope.row.label}`">
                    <el-button
                      icon="el-icon-edit"
                      circle
                      @click.native="editAttribute(scope.row)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip :content="`Remove attribute ${scope.row.label}`">
                    <el-popconfirm
                      title="Are you sure to delete this?"
                      @confirm="delAttribute(cat.row, scope.row.serverId)">
                      <el-button
                        type=danger
                        icon="el-icon-delete"
                        circle
                        slot="reference"
                      ></el-button>
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          <el-tooltip :content="`Add attribute to ${cat.row.name}`">
            <el-button
              icon="el-icon-plus"
              circle
              @click.native="addAttribute(cat.row)"
            ></el-button>
          </el-tooltip>
          </div>
        </el-table-column>
        <el-table-column label="Name">
          <b slot-scope="cat" v-on:click.stop
                          v-on:input.stop
                          v-on:keyup.stop
                          v-on:keydown.stop
                          v-on:focus.stop
                          v-on:blur.stop
                          v-on:change.stop
                          v-on:keypress.stop>
            <editable :content.sync="cat.row.name" :isEditing="cat.row.isEditing">
              {{ cat.row.name }}
            </editable>
          </b>
        </el-table-column>
        <el-table-column label="Actions" fixed="right" width=200>
          <div slot-scope="cat">
            <el-tooltip :content="`Edit category ${cat.row.name}`">
              <el-button
                icon="el-icon-edit"
                circle
                @click.native="editCategory(cat.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="`Remove category ${cat.row.name}`">
              <el-popconfirm
                title="Are you sure to delete this?"
                @confirm="delCategory(cat.row)">
                <el-button
                  slot="reference"
                  type=danger
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
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
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service"
import { FileSystem } from 'spinal-core-connectorjs_type'

import NodeTable from "./NodeTable.vue";
import Editable from "../../../compoments/Editable.vue";
import { spinalIO } from '../../../services/spinalIO';
export default {
  name: "Attributes",
  components: { NodeTable, Editable },
  props: {
    Properties: {
      required: true,
      type: Object,
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
        }
        else
        {
          this.Categories = false;
          this.ctxNode = false;
        }
      },
      deep: true,
    }
  },
  mounted()
  {
    this.update(this.Properties.view.serverId);
  },
  methods: {
    async update(id)
    {
      this.ctxNode = FileSystem._objects[id];
      console.debug("start");
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
                type: attribute.type._data,
                unit: attribute.unit._data,
                isEditing: false,
                serverId: attribute._server_id,
              });
            }
            let cat = {
              cat: category,
              name: category.nameCat,
              attributes: attrs,
              isEditing: false,
            }
            this.Categories.push(cat);
          })
        }
      })
      console.debug("end");
    },
    async addAttribute(category){
      const node = await serviceDocumentation.addAttributeByCategory(this.ctxNode, category.cat, "newAttribute", "newValue", "newType", "newUnit");
      await spinalIO.waitNodeReady(node);
      category.attributes.push({
        label: "newAttribute",
        value: "newValue",
        type: "newType",
        unit: "newUnit",
        isEditing: false,
        serverId: node._server_id,
      })
    },
    async delAttribute(category, attribute_id){
      await serviceDocumentation.removeAttributesById(category.cat.node, attribute_id)
      category.attributes = category.attributes.filter(attr => (attr.serverId != attribute_id))
    },
    async editAttribute(attribute){
      if (!attribute.isEditing)
      {
        attribute.isEditing = true;
        return;
      }
      await serviceDocumentation.setAttributeById(this.ctxNode, attribute.serverId, attribute.label, attribute.value, attribute.type, attribute.unit);
      attribute.isEditing = false;
    },
    async addCategory(){
      const category = await serviceDocumentation.addCategoryAttribute(this.ctxNode, "NewCategory");
      this.Categories.push({
        cat: category,
        name: "NewCategory",
        attributes: [],
        isEditing: false,
      })
    },
    async delCategory(category){
      await serviceDocumentation.delCategoryAttribute(this.ctxNode, category.cat.node._server_id)
      this.Categories = this.Categories.filter(cat => !(cat.cat.node._server_id == category.cat.node._server_id))
    },
    async editCategory(category){
      if (!category.isEditing)
      {
        category.isEditing = true;
        return;
      }
      await serviceDocumentation.editCategoryAttribute(this.ctxNode, category.cat.node._server_id, category.name)
      category.isEditing = false;
    },
    httpify(url)
    {
      if (!url.startsWith("http"))
      {
        return "http://" + url;
      }
      return url;
    },
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>