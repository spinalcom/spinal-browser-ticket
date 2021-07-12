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
      <h2>Category Attributes</h2>
    </el-header>
    <el-main v-if="Category">
      {{ Category.name._data }} : {{ Category.id._data }}
    </el-main>
  </el-container>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { spinalBackEnd } from "../../../services/spinalBackend";
import { spinalIO } from '../../../services/spinalIO';
export default {
  name: "CategoryAttributes",
  props: {
    propList: { type: Object, default: function () { return {} } },
    },
  data() {
    return {
      currentView: null,
      contextServId: 0,
      item: [],
      Category: null,
    }
  },
  async mounted() {
    await spinalBackEnd.waitInit()
    ViewManager.getInstance(this.propList.viewKey).viewSubscribe(this.onViewChange.bind(this), 0);
  },
  methods: {
    async onViewChange(view) {
      let mapItems;
      if (view.serverId === 0) {
        this.contextServId = 0;
        mapItems = await spinalBackEnd.DataRoomBack.getContexts();
      } else {
        if (this.contextServId === 0) {
          this.contextServId = view.serverId;
        }
        mapItems = await spinalBackEnd.DataRoomBack.getItems(
          view.serverId,
          this.contextServId
        );
      }

      this.Category = null

      for (const [nodeType, items] of mapItems) {
        const node = FileSystem._objects[items[0].serverId]
        if (node.children)
        {
          if (node.children.PtrLst._attribute_names.includes("hasCategoryAttributes"))
          {
            const CategoryID = node.children.PtrLst.hasCategoryAttributes.children.ptr;
            if (CategoryID)
            {
              const Category = await spinalIO.loadPtr(CategoryID)
              if (typeof Category !== 'undefined')
              {
                this.Category = Category[0].info
              }
            }
          }
        }
      }

      this.currentView = view;
    },
  },
}
</script>