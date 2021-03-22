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
  <div v-if="items !== false">
    <el-container>
      <el-header>
        {{ $t(`node-type.${items.nodeType}`) }}
      </el-header>
      <el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
// import { spinalBackEnd } from "../../../services/spinalBackend";
import { EquipmentBack } from '../backend/EquipmentBack'


export default {
  name: "CategoryAttribute",
  components: {  },
  props : {
    Properties:
    {
      required: true,
      type: Object,
      validator: function (value)
      {
        if (value.viewKey == "")
        {
          return('danger')
        }
        return('success')
      }
    }
  },
  data() {
    return {
      items: false,
      contextServId: 0,
      currentView: null,
    };
  },
  async mounted()
  {
    // Get the ViewManager instance for the TicketCenter viewKey and initializes it
    await ViewManager.getInstance(this.Properties.viewKey).viewSubscribe(this.onViewChange.bind(this), 0);
  },
  methods: {
    async onViewChange(view)
    {
      let mapItems = [];
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await EquipmentBack.getInstance().getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await EquipmentBack.getInstance().getItems(
          view.serverId,
          this.contextServId
        );
      }
      for (const [nodeType, items] of mapItems) {
        const cols = new Set()
        for (const item of items) {
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes)
            }
          }
        }
        this.items = {nodeType, items, cols: Array.from(cols)};
      }
      this.currentView = view;
    },
    async debug(what)
    {
      console.log("Debugging", what);
    },
  },
};
</script>