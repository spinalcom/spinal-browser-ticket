<template>
  <div class="spinal-main-container">
    <div v-show="!absviewer"
         ref="viewerContainer"
         class="spinal-viewer-container"
         :class="{'abs-viewer' : absviewer}">
      <div ref="viewerContent"
           class="viewer-content">
        <appViewer :isMinimized="absviewer">
        </appViewer>
      </div>
      <el-button icon="el-icon-files"
                 size="mini"
                 class="btn-abs-viewer"
                 @click="onMini"></el-button>
    </div>
    <div class="spinal-other-container">other</div>
    <transition name="fade">
      <div v-show="absviewer"
           ref="viewerContainerMini"
           class="viewer-container-mini">
        <div ref="headerViewer"
             class="spinal-viewer-header-container">
          <el-button icon="el-icon-files"
                     size="mini"
                     class="btn-abs-viewer"
                     @click="onMini"></el-button>

        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import createDragElement from "../../services/utlils/createDragElement";
import appViewer from "./viewer/viewer.vue";
export default {
  name: "main-content",
  data() {
    return {
      absviewer: false
    };
  },
  components: { appViewer },
  mounted() {
    createDragElement(this.$refs.viewerContainerMini, this.$refs.headerViewer);
  },
  methods: {
    onMini() {
      this.absviewer = !this.absviewer;
      if (this.absviewer) {
        this.$refs.viewerContainerMini.append(this.$refs.viewerContent);
      } else {
        this.$refs.viewerContainer.append(this.$refs.viewerContent);
      }
    }
  }
};
</script>

<style>
.spinal-main-container,
.spinal-main-container > .spinal-viewer-container,
.spinal-main-container > .spinal-other-container {
  transition: 200ms all cubic-bezier(0.075, 0.82, 0.165, 1);
}

.spinal-main-container {
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
}
.spinal-viewer-container {
  height: 100%;
  width: 50%;
  background-color: #ededed;
  position: relative;
}
.spinal-other-container {
  height: 100%;
  width: 50%;
  background-color: green;
  position: relative;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .spinal-viewer-container {
    height: 50%;
    width: 100%;
  }
  .spinal-other-container {
    height: 50%;
    width: 100%;
  }
  .spinal-main-container {
    display: block;
  }
}

.abs-viewer ~ .spinal-other-container {
  height: 100%;
  width: 100%;
  /* z-index: 0; */
}
.btn-abs-viewer {
  position: absolute;
  z-index: 1000;
  top: 0;
  right: 0;
  border-top-right-radius: 3px !important;
  border-bottom-right-radius: 0 !important;
}
.spinal-viewer-header-container {
  height: 28px;
  border: 1px solid;
  border-radius: 3px;
  width: 100%;
  cursor: move;
  position: relative;
  background-color: rgb(48, 49, 51);
}

/* .spinal-viewer-container.abs-viewer {
  opacity: 0;
  visibility: hidden;
  transition: all ease-out 0.2s;
} */

.viewer-content {
  position: relative;
  height: 100%;
  width: 100%;
}
.viewer-container-mini {
  background-color: blueviolet;
  --minimized-viewer-width: 300px;
  --minimized-viewer-height: 200px;
  border-radius: 10px;
  z-index: 1;
  width: var(--minimized-viewer-width);
  height: var(--minimized-viewer-height);
  /* transition: all ease-out 0.5s; */
  /* -webkit-transition: all ease-out 0.5s; */
  /* -moz-transition: all ease-out 0.5s; */
  position: absolute;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  left: calc(100% - var(--minimized-viewer-width) - 8px);
  top: calc(100% - var(--minimized-viewer-height) - 8px);
}
</style>
