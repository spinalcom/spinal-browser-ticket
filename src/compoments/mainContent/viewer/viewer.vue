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
// import { viewerUtils } from "./viewerUtils";
import { spinalBackEnd } from "../../../services/spinalBackend";
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
      console.log(this.isMinimized);
      if (this.isMinimized && this.viewer) {
        this.viewer.toolbar.setDisplay("none");
        this.viewer.viewCubeUi.setVisible(false);
      } else {
        this.viewer.toolbar.setDisplay("");
        this.viewer.viewCubeUi.setVisible(true);
      }
      setTimeout(this.viewer.resize.bind(this.viewer), 400);
    }
  },
  async mounted() {
    const container = document.getElementById("autodesk_forge_viewer");
    this.forgeViewer = new ForgeViewer(container, false);
    // forgeExtentionManager.viewer = this.forgeViewer.viewer;
    await this.forgeViewer.start(
      "/models/Resource/3D View/{3D} 341878/{3D}.svf",
      true
    );

    // await window.spinal.SpinalForgeViewer.initialize(this.forgeViewer);
    // let scenes = await GraphService.getScene();
    // await window.spinal.SpinalForgeViewer.loadModelFromNode(
    //   scenes[0].info.id.get()
    // );
    this.viewer = this.forgeViewer.viewer;

    await spinalBackEnd.waitInit();
    const scenes = await spinalBackEnd.viewerBack.getScenes();
    await spinalBackEnd.viewerBack.loadScene(scenes[0], this.forgeViewer);
    this.viewer.fitToView();
    // // viewerUtils.initViewer(this.forgeViewer.viewer);
    // // this.createSetColor();
    // // this.createRestoreColor();
    // // this.getEvents();
    // const exten = forgeExtentionManager.getExtentions();

    // exten.forEach(ext => {
    //   this.forgeViewer.loadExtension(ext);
    // });

    // viewerUtils.fitToView();
    // eventViewerManager.init(this.viewer, forgeExtentionManager);
  },
  methods: {}
};
</script>

<style scoped>
.viewerContainer {
  position: relative;
  height: 100%;
  widows: 100%;
}
</style>
