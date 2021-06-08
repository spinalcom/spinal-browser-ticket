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
      <el-row :gutter="10">
        <el-col :span=6 v-for="doc in documents" :key="doc._server_id">
          <el-card>
            <div slot="header">
              <span> {{ doc.name }} </span>
            </div>
            <el-tooltip :content="`Remove document`">
              <el-button
                icon="el-icon-minus"
                circle
                :disabled="ctxNode == false"
                @click.native="delDocument(doc._server_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="`Download document`">
              <el-button
                icon="el-icon-bottom"
                circle
                :disabled="ctxNode == false"
                @click.native="downloadDocument(doc._server_id)"
              ></el-button>
            </el-tooltip>
          </el-card>
        </el-col>
      </el-row>
      <el-tooltip :content="`Add document`">
        <el-button
          icon="el-icon-plus"
          circle
          :disabled="ctxNode == false"
          @click.native="addDocument()"
        ></el-button>
      </el-tooltip>
    </el-main>
  </el-container>
</template>

<script>
import { FileSystem } from 'spinal-core-connectorjs_type'
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";

export default {
  name: "Attributes",
  components: {  },
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
      documents: [],
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
          this.ctxNode = false;
        }
      },
      deep: true,
    }
  },
  methods: {
    async update(id)
    {
      this.ctxNode = FileSystem._objects[id];
      await this.getDocuments();
    },
    async getDocuments()
    {
      this.documents = [];
      const directory = await FileExplorer.getDirectory(this.ctxNode);
      if (!directory)
        return;
      for (let i = 0; i < directory.length; ++i)
      {
        this.documents.push(directory[i]);
      }
    },
    addDocument()
    {
      console.debug("WIP: add doc");

    },
    async delDocument(id)
    {
      console.debug("WIP: del doc", id);
      const directory = await FileExplorer.getDirectory(this.ctxNode);
      if (!directory)
        return;
      for (let i = 0; i < directory.length; ++i)
      {
        if (directory[i]._server_id == id)
        {
          directory.splice(i, 1);
          this.documents.splice(i, 1);
        }
      }
    },
    downloadDocument(id)
    {
      console.debug("WIP: download doc", id);
    },
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>