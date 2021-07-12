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
      <h2>Documentation</h2>
    </el-header>
    <el-main>

    </el-main>
  </el-container>
</template>

<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
import { spinalBackEnd } from "../../../services/spinalBackend";
import { spinalIO } from '../../../services/spinalIO';
export default {
  name: "Documentation",
  props: {
    propList: { type: Object, default: function () { return {} } },
    },
  data() {
    return {
      currentView: null,
      contextServId: 0,
      item: [],
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

      for (const [nodeType, items] of mapItems) {
        if (nodeType == "BIMObject")
        {
          console.log(items)
        }
        // console.log(nodeType, " : ", await items[0].getBimObjects())
        // for (const BimObject of await items[0].getBimObjects()){
        //   if (BimObject.name.startsWith("Under_Ceiling_Split"))
        //     console.log(BimObject)
        // }
      }

      this.currentView = view;
    },
  },
}
</script>
<!--
<script>
import { ViewManager } from "../../../services/ViewManager/ViewManager";
const VIEWKEY_DATA_ROOM_CENTER = "Data room";
import { SpinalBackEnd, spinalBackEnd } from "../../../services/spinalBackend";
import '../../../router/DataRoom/DataRoomEventHandler';
import TabManager from '../TabManager.vue';
export default {
  name: "CategoryAttribute",
  components: {TabManager  },
  data() {
    return {
      currentView: null,
      viewKey: VIEWKEY_DATA_ROOM_CENTER,
      contextServId: 0,
      items: [],
      activeNames: [],
      haveArea: false,
    };
  },
  async mounted() {
    ViewManager.getInstance(this.viewKey).viewSubscribe(this.onViewChange.bind(this), 0);
    this.update();
  },
  watch: {
    items() {
      this.update();
    }
  },
  methods: {
    roundNumber,
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
      this.items = [];
      this.activeNames = [];
      for (const [nodeType, items] of mapItems) {
        const cols = new Set();
        for (const item of items) {
          if (item.children) {
            for (const [childTypes] of item.children) {
              cols.add(childTypes);
            }
          }
        }
        this.items.push({ nodeType, items, cols: Array.from(cols) });
        this.activeNames.push(nodeType);
      }

      this.currentView = view;
    },
    update() {
      this.haveArea = false;
      const res = [];
      const prom = [];
      for (const item of this.items) {
        console.log(item)
        const resItem = {
          name: item.name,
          serverId: item.serverId,
          haveChild: false,
          area: 0
        };
        if (resItem.color) colorUsed.push(resItem.color);
        if (item.isLocationType()) this.haveArea = true;
        prom.push(
          item.items[0].getArea().then(result => {
            resItem.area = result;
          })
        );
        res.push(resItem);
      }

      this.data = res;
      this.loading = false;
      Promise.all(prom).then(() => {
        this.loadingArea = false;
      });
    }
  }
};
</script>

<style>
.data-room-barre {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  background-color: #f5f7fa;
}
/* .data-room .el-icon-download {
  width: 15px;
} */

.data-room .el-collapse-item__header {
  direction: rtl;
}
</style>

<style scoped>
.data-room-collapse-bar {
  direction: ltr;
  display: flex;
  flex-grow: 1;
}
.data-room-collapse-bar-title {
  flex-grow: 1;
}
</style>
-->