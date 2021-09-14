/*
 * Copyright 2020 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { EventBus } from "../../event";
import { viewerUtils } from "../viewerUtils";
import { spinalBackEnd } from '../../spinalBackend';
import { EQUIPMENT_TYPE, GEO_RELATIONS } from "../../../constants";

var lastColorZone = null;
var lastColorItem = null;

function sortBIMObjectByModel(arrayOfBIMObject): { selection: number[], model }[] {
  let arrayModel = [];
  for (const nodeBIMObject of arrayOfBIMObject) {
    const bimFileId = nodeBIMObject.info.bimFileId.get();
    const dbId = nodeBIMObject.info.dbid.get();
    const model = window.spinal.BimObjectService.getModelByBimfile(bimFileId);
    if (model) {
      const obj = getOrAddModelIfMissing(arrayModel, model);
      obj.selection.push(dbId);
    }
  }
  return arrayModel;
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

async function getLstByModel(item, addRoomRef = false) {
  const node = FileSystem._objects[item.server_id];
  const relations = [...GEO_RELATIONS, "hasReferenceObject.ROOM"]
  const listNode = await node.find(relations, (n) => {
    return (n.getType().get() === EQUIPMENT_TYPE || n.getType().get() === "BimObject");
  });
  return sortBIMObjectByModel(listNode);
}

EventBus.$on('test-color-item', async (item) => {
  console.debug("test color")
  if (lastColorItem || (lastColorZone &&
    lastColorZone.server_id === item.server_id)) {
    lastColorItem = null
    lastColorZone = null
    viewerUtils.restoreColorThemingItems()
  } else {
    viewerUtils.restoreColorThemingItems()
    lastColorZone = null
    lastColorItem = item
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    for (const { selection, model } of lstByModel) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
  }
});

EventBus.$on('test-color-all', async (items, zone) => {
  console.debug("test color all")
  if (lastColorItem || (lastColorZone &&
    lastColorZone.server_id === zone.server_id)) {
    lastColorItem = null
    lastColorZone = null
    viewerUtils.restoreColorThemingItems()
  } else {
    viewerUtils.restoreColorThemingItems()
    lastColorZone = zone
    lastColorItem = null
    for (const item of items) {
        console.debug("item", item)
        const lstByModel = await getLstByModel(item, true);
        console.debug("list", lstByModel)
      for (const { selection, model } of lstByModel) {
        console.debug("coloring", model, item.color, selection)
        viewerUtils.colorThemingItems(model, item.color, selection);
      }
    }
  }
});

EventBus.$on('test-isolate-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
  viewerUtils.isolateObjects(lstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(lstByModel);
});

EventBus.$on('test-show-all', () => {
  viewerUtils.showAll()
});

EventBus.$on('test-isolate-all', async (zone) => {
  const zoneLstByModel = await spinalBackEnd.spatialBack.getLstByModel(zone);
  viewerUtils.isolateObjects(zoneLstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(zoneLstByModel);
});

EventBus.$on('test-zoom-all', async (zone) => {
  const zoneLstByModel = await spinalBackEnd.spatialBack.getLstByModel(zone);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(zoneLstByModel);
});

EventBus.$on('test-focus-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
  viewerUtils.selectObjects(lstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(lstByModel);
});

EventBus.$on('test-select-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
  viewerUtils.selectObjects(lstByModel);
});
