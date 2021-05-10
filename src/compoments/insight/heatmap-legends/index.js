import vue from "vue";
import legendsHeatmap from "./container.vue";

let legendsHeatmapComponent = vue.extend(legendsHeatmap);
let app = new legendsHeatmapComponent();

// app.$mount();
// document.getElementById("autodesk_forge_viewer").appendChild(app.$el);