import { EventBus } from "../../event";
import { viewerUtils } from "../viewerUtils";


type BimObj = {
    bimFileId: string
    dbid: number
    externalId: string
    id: string
    name: string
    type: string
  }


  function getOrAddModelIfMissing(array, model): { selection: number[], model } {
    for (const obj of array) {
      if (obj.model === model) {
        return obj;
      }
    }
    const obj = {
      selection: [],
      model
    };
    array.push(obj);
    return obj;
  }

  function sortBIMObjectByModel(bimObj: BimObj[]): { selection: number[], model }[] {
    const anyWin: any = window;
    let arrayModel = [];
  
    for (const nodeBIMObject of bimObj) {
      const bimFileId = nodeBIMObject.bimFileId;
      const dbId = nodeBIMObject.dbid;
      const model = anyWin.spinal.BimObjectService.getModelByBimfile(bimFileId);
      const obj = getOrAddModelIfMissing(arrayModel, model);
      obj.selection.push(dbId);
    }
    return arrayModel;
  }


  

EventBus.$on("insight-isolate", async (data) => {
    /*const item = {
      server_id: data.ids?.[0]?.dbid,
    }*/
    await viewerUtils.waitInitialized()
    viewerUtils.clearSelection()
    const lstByModel = sortBIMObjectByModel(data.ids);
    viewerUtils.isolateObjects(lstByModel);
});




EventBus.$on("insight-select", async (data) => {
    await viewerUtils.waitInitialized()
    viewerUtils.clearSelection()
    const lstByModel = sortBIMObjectByModel(data.ids);
    viewerUtils.selectObjects(lstByModel);
});



EventBus.$on("insight-focus", async (data) => {
    await viewerUtils.waitInitialized()
    viewerUtils.clearSelection()
    const lstByModel = sortBIMObjectByModel(data.ids);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
});




