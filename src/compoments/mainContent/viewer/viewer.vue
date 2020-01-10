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
  <div class="viewerContainer"
       id="autodesk_forge_viewer">
  </div>
</template>

<script>
import { ForgeViewer } from "spinal-forge-viewer";
// import GraphService from "../../config/GraphService";
// import { forgeExtentionManager } from "./ForgeExtentionManager";
// import { eventViewerManager } from "./EventViewerManager";
import { spinalBackEnd } from "../../../services/spinalBackend";
import { viewerUtils } from "../../../services/viewerUtils/viewerUtils";
import "spinal-env-viewer-plugin-forge";
export default {
  name: "appViewer",
  props: ["isMinimized"],
  data() {
    return {
      viewer: null,
      ticketToZoom: [],
      colors: {},
      materials: {}
    };
  },
  watch: {
    isMinimized() {
      if (this.viewer && this.viewer.toolbar && this.viewer.viewCubeUi) {
        if (this.isMinimized) {
          this.viewer.toolbar.setDisplay("none");
          this.viewer.viewCubeUi.setVisible(false);
        } else {
          this.viewer.toolbar.setDisplay("");
          this.viewer.viewCubeUi.setVisible(true);
        }
        setTimeout(this.viewer.resize.bind(this.viewer), 400);
      }
    }
  },
  mounted() {
    return this.createViewer();
    // const container = document.getElementById("autodesk_forge_viewer");
    // this.forgeViewer = new ForgeViewer(container, false);
    // // forgeExtentionManager.viewer = this.forgeViewer.viewer;
    // await this.forgeViewer.start(
    //   "/models/Resource/3D View/{3D} 341878/{3D}.svf",
    //   true
    // );

    // // await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
    // // let scenes = await GraphService.getScene();
    // // await window.spinal.SpinalForgeViewer.loadModelFromNode(
    // //   scenes[0].info.id.get()
    // // );
    // this.viewer = this.forgeViewer.viewer;

    // await spinalBackEnd.waitInit();
    // const scenes = await spinalBackEnd.viewerBack.getScenes();
    // await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
    // this.viewer.fitToView();
    // // // viewerUtils.initViewer(this.forgeViewer.viewer);
    // // // this.createSetColor();
    // // // this.createRestoreColor();
    // // // this.getEvents();
    // // const exten = forgeExtentionManager.getExtentions();

    // // exten.forEach(ext => {
    // //   this.forgeViewer.loadExtension(ext);
    // // });

    // // viewerUtils.fitToView();
    // // eventViewerManager.init(this.viewer, forgeExtentionManager);
  },
  methods: {
    async createViewer() {
      const container = document.getElementById("autodesk_forge_viewer");
      this.forgeViewer = new ForgeViewer(container, false);
      await this.forgeViewer.start(
        "/models/Resource/3D View/{3D} 341878/{3D}.svf",
        true
      );
      this.viewer = this.forgeViewer.viewer;
      await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
      const scenes = await spinalBackEnd.viewerBack.getScenes();
      await window.spinal.SpinalForgeViewer.loadModelFromNode(
        scenes[0].info.id.get()
      );
      await spinalBackEnd.waitInit();
      // const scenes = await spinalBackEnd.viewerBack.getScenes();
      // await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
      this.viewer.fitToView();
      viewerUtils.initViewer(this.viewer);
    }
  }
};
</script>

<style scoped>
.viewerContainer {
  position: relative;
  height: 100%;
  widows: 100%;
}
</style>
