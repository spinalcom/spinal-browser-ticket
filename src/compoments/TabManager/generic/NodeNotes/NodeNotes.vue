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
      <node-notes-create
        v-if="ctxNode"
        :node="ctxNode"
        @send-note="sendNote"
      ></node-notes-create>
    </el-header>

    <el-main style="">
      <div class="note-feed">
        <el-container
          v-for="note of notes"
          :key="note._server_id"
          style="display: flex; flex-direction: row; align-items: flex-start; margin-bottom: 10px"
        >
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
          <el-tooltip
            :content="$t('spinal-twin.DeleteNote')"
            class="delete-button"
          >
            <el-popconfirm
              @confirm="delNote(note.selectedNode)"
              :title="$t('spinal-twin.DeleteConfirm')">
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
        </el-container>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { FileSystem } from 'spinal-core-connectorjs_type'
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import NodeNotesMessage from "./NodeNotesMessage.vue";
import NodeNotesCreate from './NodeNotesCreate.vue';

export default {
  name: "NodeNotes",
  components: { NodeNotesMessage, NodeNotesCreate },
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
      console.debug("NOTE start")
      this.ctxNode = FileSystem._objects[id];
      console.debug("NOTE end")
      this.notes = [];
      this.notes = await serviceDocumentation.getNotes(this.ctxNode);
      this.new_note = "";
      this.attachment = false;
    },

    async sendNote(text, pack)
    {
      this.update(this.Properties.view.serverId);
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
.note-feed {
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  flex-wrap: wrap;
}

.delete-button {
  padding: 25px 10px 10px 10px;
}
</style>