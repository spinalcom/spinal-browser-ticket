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
    <el-header>
      <el-tooltip :content="`Add document`">
        <el-button
          :disabled="ctxNode == false"
          @click.native="addDocument()"
          icon="el-icon-plus"
          circle
          type="primary"
          style="float: right"
        ></el-button>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-table
        :data="documents"
        :header-cell-style="{'background-color': '#f0f2f5'}"
        border
        style="overflow: auto; height: 100%"
      >
        <el-table-column label="Document">
          <div slot-scope="scope">
            {{ scope.row.name }}
          </div>
        </el-table-column>
        <el-table-column
            label="Actions"
            fixed="right"
            width=120>
          <div slot-scope="scope">
            <el-tooltip :content="`Download document`">
              <el-button
                @click.native="downloadDocument(scope.row._server_id)"
                icon="el-icon-download"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip :content="`Remove document`">
              <el-popconfirm
                @confirm="delDocument(scope.row._server_id)"
                :title="$t('spinal-twin.DeleteConfirm')">
                <el-button
                  icon="el-icon-delete"
                  circle
                  type=danger
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { FileSystem } from 'spinal-core-connectorjs_type'
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";

export default {
  name: "NodeDocumentation",
  components: {  },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      documents: [],
      directory: false,
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

  async mounted() {
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async update(id)
    {
      this.ctxNode = FileSystem._objects[id];
      this.directory = await FileExplorer.getDirectory(this.ctxNode);
      await this.getDocuments();
    },

    docAt(serverId)
    {
      for (const doc of this.documents)
      {
        if (doc._server_id == serverId)
        {
          return doc;
        }
      }
      return null;
    },

    async getDocuments()
    {
      this.documents = [];
      if (!this.directory)
        return;
      for (let i = 0; i < this.directory.length; ++i)
      {
        this.documents.push(this.directory[i]);
      }
    },

    async addDocument()
    {
      const maxSize = 25000000;
      const input = document.createElement("input");

      if (!this.directory)
      {
        this.directory = await FileExplorer.createDirectory(this.ctxNode);
      }
      input.type = "file";
      input.multiple = true;
      input.click();
      input.addEventListener(
        "change",
        event => {
          const files = event.target.files;
          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }
          // filelist.push(...this.messages.pj);
          const sizes = filelist.map(el => el.size);
          const filesSize = sizes.reduce((a, b) => a + b);
          if (filesSize > maxSize) {
            alert(
              `The selected file(s) is too large. The maximum size must not exceed ${maxSize / 1000000} MB`
            );
            return;
          }
          // this.messages.pj = filelist;
          console.log(filelist);
          FileExplorer.addFileUpload(this.directory, filelist);
          this.$emit("reload");
          this.update(this.Properties.view.serverId);
        },
        false
      );
    },

    async delDocument(id)
    {
      if (!this.directory)
        return;
      for (let i = 0; i < this.directory.length; ++i)
      {
        if (this.directory[i]._server_id == id)
        {
          this.directory.splice(i, 1);
          this.documents.splice(i, 1);
        }
      }
    },

    downloadDocument(id)
    {
      const file = this.docAt(id);
      if (file._info.model_type.get() != "Directory") {
        file._ptr.load(path => {
          if (file._info.model_type.get() == "HttpPath") {
            const element = document.createElement("a");
            const _path =
              path.host.get() +
              "/file/" +
              encodeURIComponent(path.httpRootPath.get()) +
              "/" +
              encodeURIComponent(path.httpPath.get());
            element.setAttribute("href", _path);
            element.setAttribute("download", file.name.get());
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          } else {
            var element = document.createElement("a");
            element.setAttribute("href", "/sceen/_?u=" + path._server_id);
            element.setAttribute("download", file.name);
            element.click();
          }
        });
      } else {
        // check recursive directory & create a ZIP
      }
    },
  
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>