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
  <el-container style="overflow: hidden">
    <el-header>
      <el-container style="overflow: hidden">
        <el-dropdown class="spl-input-button">
          <el-button type="primary">
            Options
            <i class="el-icon-arrow-up el-icon--right"/>
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            style="overflow: hidden"
          >
            <el-tooltip
              content="Add current position as attachment"
              placement="right"
            >
              <el-dropdown-item
                v-on:click.native="addPostion()"
                icon="el-icon-position"
              ></el-dropdown-item>
            </el-tooltip>
            <el-tooltip
              content="Add a screenshot of the viewer as attachment"
              placement="right"
            >
              <el-dropdown-item
                v-on:click.native="addScreenshot()"
                icon="el-icon-camera"
              ></el-dropdown-item>
            </el-tooltip>
            <el-tooltip
              content="Add file as attachment"
              placement="right"
            >
              <el-dropdown-item
                v-on:click.native="addFile()"
                icon="el-icon-paperclip"
              ></el-dropdown-item>
            </el-tooltip>
          </el-dropdown-menu>
        </el-dropdown>
        <el-input
          v-model="new_note"
          v-on:keydown.enter.native="enterHandler"
          type="textarea"
          resize="none"
        ></el-input>
        <el-tooltip content="Send note">
          <el-button
            v-on:click.native="sendNote()"
            class="spl-input-button"
            icon="el-icon-s-promotion"
            type="primary"
          >
            Send
          </el-button>
        </el-tooltip>
      </el-container>
      <el-card v-if="attachment" style="margin: 10px">
        {{ attachment.file.name }}
      </el-card>
    </el-header>
    <el-main style="overflow: hidden">
      <div
        style="overflow: auto; display: flex; flex-direction: column-reverse"
      >
        <el-container
          v-for="note of notes"
          :key="note._server_id"
        >
          <el-header
            style="padding: 10px 0 0 0;
            display: flex;
            flex-direction: row-reverse;
            height: min-content;"
          >
            <el-tooltip content="Delete note">
              <el-popconfirm
                @confirm="delNote(note.selectedNode)"
                title="Are you sure to delete this?">
                <el-button
                  class="spl-input-button"
                  icon="el-icon-delete"
                  type="danger"
                  size="small"
                  circle
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </el-tooltip>
            <!-- <el-button
              v-on:click.native="debug(note)"
              class="spl-input-button"
              icon="el-icon-search"
              type="primary"
              size="small"
              circle
            ></el-button> -->
          </el-header>
          <el-main style="padding: 0 0 10px 0">
            <node-notes-message
              :username="note.element.username.get()"
              :date="note.element.date.get()"
              :message="note.element.message.get()"
              :type="note.element.type.get()"
              :file="note.element.file ? note.element.file : {}"
              :viewPoint="note.element.viewPoint ? note.element.viewPoint : null"
            ></node-notes-message>
          </el-main>
        </el-container>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { FileSystem } from 'spinal-core-connectorjs_type'
import { FileExplorer } from "spinal-env-viewer-plugin-documentation-service/dist/Models/FileExplorer";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import NodeNotesMessage from "./NodeNotesMessage.vue";
import moment from "moment";

export default {
  name: "NodeNotes",
  components: { NodeNotesMessage },
  props: {
    Properties: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      ctxNode: false,
      notes: false,
      new_note: "",
      attachment: false,
    };
  },

  computed:
  {
    user()
    {
      return {
        username: "admin",
        userId: FileSystem._user_id
      };
    }
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

  mounted() {
    this.update(this.Properties.view.serverId);
  },

  methods: {
    async update(id)
    {
      this.ctxNode = FileSystem._objects[id];
      this.notes = [];
      this.notes = await serviceDocumentation.getNotes(this.ctxNode);
      this.new_note = "";
      this.attachment = false;
    },
    
    DateFormat(date)
    {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },

    async $_sendnote(type, file = undefined, state = undefined, contextID = undefined, groupID = undefined)
    {
      return await serviceDocumentation.twinAddNote(
        this.ctxNode,
        this.user,
        this.new_note,
        type,
        file,
        state,
        contextID,
        groupID
      );
    },

    async sendNote()
    {
      if (this.attachment)
      {
        if (this.new_note.trim() === "")
        {
          this.new_note = this.attachment.file.name;
        }
        await this.$_sendnote(
          this.attachment.type,
          this.attachment.file,
          this.attachment.view
        );
        await this.update(this.Properties.view.serverId);
        return
      }
      await this.$_sendnote("text");
      await this.update(this.Properties.view.serverId);
    },
    
    enterHandler: function (e)
    {
      if (e.ctrlKey) this.sendNote();
    },

    getScreenShotFile(isViewPoint = false) {
      return new Promise(async (resolve) => {
        window.spinal.SpinalForgeViewer.viewerManager.viewer.getScreenShot(
          0, 0,
          async (url) => {
            let blob = await fetch(url).then((r) => r.blob());
            let fileName = (isViewPoint ? "viewPoint" : "screenshot")
              + ` of ${this.ctxNode.getName().get()} from `
              + `${moment().format("L")}.png`;
            blob.lastModifiedDate = new Date();
            blob.name = fileName;
            resolve(blob);
          }
        );
      });
    },

    async getViewPoint() {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      const viewer = window.spinal.SpinalForgeViewer.viewerManager.viewer;
      const filter = {
        guid: true,
        seedURN: true,
        overrides: true,
        objectSet: false,
        viewport: true,
        renderOptions: true,
      };
      const file = await this.getScreenShotFile(true);
      let state = {
        viewState: undefined,
        objectState: undefined
      };
      const viewerState = viewer.getState(filter);
      const objectState = {
        isolated: viewer
          .getAggregateIsolation()
          .map((el) => ({ modelId: el.model.id, ids: el.ids })),
        selected: viewer
          .getAggregateSelection()
          .map((el) => ({ modelId: el.model.id, selection: el.selection })),
      };
      state.viewState = JSON.stringify(viewerState, getCircularReplacer());
      state.objectState = JSON.stringify(objectState, getCircularReplacer());
      return {file, state};
    },

    async addPostion()
    {
      const viewPoint = await this.getViewPoint();
      this.attachment = {
        type: "view",
        file: viewPoint.file,
        view: viewPoint.state
      };
    },

    async addScreenshot()
    {
      const file = await this.getScreenShotFile();
      this.attachment = {
        type: "img",
        file: file,
        view: undefined
      };
    },

    addFile()
    {
      const maxSize = 25000000;
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = false;
      input.click();
      input.addEventListener(
        "change",
        (event) => {
          const files = event.target.files;
          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }
          const sizes = filelist.map((el) => el.size);
          const filesSize = sizes.reduce((a, b) => a + b);
          if (filesSize > maxSize) {
            alert(
              "The selected file(s) is too large. The maximum size must not exceed 25 MB"
            );
            return;
          }
          this.attachment = {
            type: "img",
            file: filelist[0],
            view: undefined
          };
        },
        false
      );
    },

    delNote(note)
    {
      serviceDocumentation.delNote(this.ctxNode, note);
      this.update(this.Properties.view.serverId);
    },
    
    debug(what) {
      console.debug("Debugging", what);
    },
  },
};
</script>

<style scoped>

.spl-input-button
{
  height: min-content;
  margin: auto 10px auto 10px;
  width: min-content;
}
</style>