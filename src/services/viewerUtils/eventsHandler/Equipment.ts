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

var lastColorZone = null;
var lastColorItem = null;

EventBus.$on('equipment-color-item', async (item) => {
  if (lastColorItem || (lastColorZone &&
    lastColorZone.server_id === item.server_id)) {
    lastColorItem = null
    lastColorZone = null
    viewerUtils.restoreColorThemingItems()
  } else {
    viewerUtils.restoreColorThemingItems()
    lastColorZone = null
    lastColorItem = item
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(item);
    for (const { selection, model } of lstByModel) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
  }
});

EventBus.$on('equipment-color-all', async (items, zone) => {
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
      const lstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(item, true);
      for (const { selection, model } of lstByModel) {
        viewerUtils.colorThemingItems(model, item.color, selection);
      }
    }
  }
});

EventBus.$on('equipment-isolate-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(item);
  viewerUtils.isolateObjects(lstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(lstByModel);
});

EventBus.$on('equipment-show-all', () => {
  viewerUtils.showAll()
});

EventBus.$on('equipment-isolate-all', async (zone) => {
  const zoneLstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(zone);
  viewerUtils.isolateObjects(zoneLstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(zoneLstByModel);
});

EventBus.$on('equipment-zoom-all', async (zone) => {
  const zoneLstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(zone);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(zoneLstByModel);
});

EventBus.$on('equipment-focus-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(item);
  viewerUtils.selectObjects(lstByModel);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(lstByModel);
});

EventBus.$on('equipment-select-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModelEquipment(item);
  viewerUtils.selectObjects(lstByModel);
});
