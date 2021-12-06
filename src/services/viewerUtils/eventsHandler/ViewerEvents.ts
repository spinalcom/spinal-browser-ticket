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

EventBus.$on('viewer-zoom', async (root, relation) => {
  const items = await spinalBackEnd.spatialBack.getLstByModelAndRelation(root, relation);
  await viewerUtils.rotateTo('front,top,right');
  viewerUtils.fitToView(items);
});

EventBus.$on('viewer-isolate', async (root, relation) => {
  const items = await spinalBackEnd.spatialBack.getLstByModelAndRelation(root, relation);
  viewerUtils.isolateObjects(items);
});

EventBus.$on('viewer-select', async (root, relation) => {
  const items = await spinalBackEnd.spatialBack.getLstByModelAndRelation(root, relation);
  viewerUtils.selectObjects(items);
});

EventBus.$on('viewer-reset-color', () => {
  viewerUtils.restoreColorThemingItems();
});

EventBus.$on('viewer-color', async (items, relation) => {
  viewerUtils.restoreColorThemingItems()
  items.map( async (item) => {
    const list = await spinalBackEnd.spatialBack.getLstByModelAndRelation({ server_id: item.serverId }, relation, true);
    for (const { selection, model } of list) {
      viewerUtils.colorThemingItems(model, item.color, selection);
    }
  });
});