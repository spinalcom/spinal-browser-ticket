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
    addDocument()
    {
      console.debug("WIP: add doc");
      const maxSize = 25000000;
      const input = document.createElement("input");
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
      console.debug("WIP: del doc", id);
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
      console.debug("WIP: download doc", id);
      const file = this.docAt(id);
      console.debug("file is", file)
      if (file._info.model_type.get() != "Directory") {
        file._ptr.load(path => {
          if (file._info.model_type.get() == "HttpPath") {
            console.debug("file is HttpPath", path)
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
            console.debug("file is not HttpPath", path)
            var element = document.createElement("a");
            element.setAttribute("href", "/sceen/_?u=" + path._server_id);
            element.setAttribute("download", file.name);
            element.click();
          }
        });
      } else {
          console.debug("file is directory")
        // check recursive directory & create a ZIP
      }
    },
    async debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>