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

import { EventBus } from "../../services/event";
import { viewerUtils } from "../../services/viewerUtils/viewerUtils";
import { spinalBackEnd } from '../../services/spinalBackend';
EventBus.$on('sidebar-selected-item', async (item) => {

  if (item) {
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
});
EventBus.$on('sidebar-mouseover-item', async (item) => {
  const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
  viewerUtils.selectObjects(lstByModel);
});
EventBus.$on('sidebar-homeSelect', async (item) => {

  if (!item) {
    const face = 'front,top,right';
    await viewerUtils.waitInitialized();
    viewerUtils.showAll();
    await viewerUtils.rotateTo(face);
    return viewerUtils.fitToView();
  } else {
    const lstByModel = await spinalBackEnd.spatialBack.getLstByModel(item);
    viewerUtils.isolateObjects(lstByModel);
    await viewerUtils.rotateTo('top');
    viewerUtils.fitToView(lstByModel);
  }
});
