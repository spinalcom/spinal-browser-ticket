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

import rotateTo from './rotateTo'

export class ViewerUtils {
  constructor() {
    this.restoreColorMaterialBinded = this._restoreColorMaterial.bind(this);
    this.materials = {};
    this.modelMap = new Map(); // Map<Model, Map<colorString, Set<dbIdString > > >
  }
  initViewer(viewer) {
    this.viewer = viewer;
  }

  /**
   *
   *
   * @param {string} face - "top", 'front', "right", "left", "back", 'bottom',
  "top,front", "top right", "top,left", "top,back",
  "bottom,front", "bottom,right", "bottom,left", "bottom,back",
  "left,front", "front,right", "right,back", "back,left",
  "front,top,right", "back,top,right", "front,top,left",
  "back,top,left", "front,bottom,right", "back,bottom,right",
  "front,bottom,left", "back,bottom,left"
   * @returns Promise<void>
   * @memberof ViewerUtils
   */
  rotateTo(face) {
    return rotateTo.call(this.viewer.viewCubeUi.cube, this.viewer, face);
  }

  /**
   * @param {number[] | { model, selection: number[] }[] } [selections]
   * @memberof ViewerUtils
   */
  fitToView(selections) {
    this.viewer.fitToView(selections);
  }
  /**
   * @memberof ViewerUtils
   */
  clearSelection() {
    this.viewer.clearSelection();
  }
  /**
   * clear then select
   * @param {Object[]} lstByModel
   * @param {*} lstByModel[].model - the 3d model instance.
   * @param {number[]} lstByModel[].selection - array of dbid.
   * @memberof ViewerUtils
   */
  selectObjects(lstByModel) {
    this.clearSelection();
    for (const { model, selection } of lstByModel) {
      model.selector.setSelection(selection, model, "selectOnly");
    }
  }
  /**
   * @param {Object[]} lstByModel
   * @param {*} lstByModel[].model - the 3d model instance.
   * @param {number[]} lstByModel[].selection - array of dbid.
   * @memberof ViewerUtils
   */
  isolateObjects(lstByModel) {
    for (const { model, selection } of lstByModel) {
      if (selection.length > 0) {
        this.viewer.isolate(selection, model);
      } else {
        model.getObjectTree(tree => {
          let dbidRoot = tree.nodeAccess.dbIdToIndex[model.getRootId()];
          this.viewer.isolate([dbidRoot], model);
        });
      }
    }
  }

  /**
   * @memberof ViewerUtils
   */
  showAll() {
    this.viewer.showAll();
  }
  /**
   * @param {string} h string color. e.g "#ff00ff"
   * @returns
   * @memberof ViewerUtils
   */
  cutHex(h) {
    return h.charAt(0) == "#" ? h.substring(1, 7) : h;
  }
  /**
   * @param {string} color
   * @param {string} id
   * @returns
   * @memberof ViewerUtils
   */
  addMaterial(color, id) {
    this.materials[id] = new THREE.MeshPhongMaterial({ color });

    this.viewer.impl.createOverlayScene(id, this.materials[id], this.materials[id]);
    return this.materials[id];
  }

  /**
   * @private
   * @memberof ViewerUtils
   */
  _restoreColorMaterial() {
    window.removeEventListener("click", this.restoreColorMaterialBinded, true);
    for (const [model, colorSet] of this.modelMap) {
      for (const [, setDbId] of colorSet) {
        for (const dbId of setDbId) {
          const id = `${model.id}-${dbId}`;
          var it = model.getData().instanceTree;
          if (this.materials[id]) delete this.materials[id];
          it.enumNodeFragments(dbId, (fragId) => {
            var renderProxy = this.viewer.impl.getRenderProxy(model, fragId);
            if (renderProxy[id]) {
              this.viewer.impl.clearOverlay(id);
              delete renderProxy[id];
              this.viewer.impl.invalidate(true);
            }
          }, true);
        }
      }
    }
    this.modelMap.clear();
  }
  /**
   * @private
   * @memberof ViewerUtils
   */
  _setColorMaterial() {
    for (const [model, colorSet] of this.modelMap) {
      for (const [color, setDbId] of colorSet) {
        for (const dbId of setDbId) {
          const id = `${model.id}-${dbId}`;
          if (this.materials[id]) {
            this.materials[id].color.setHex(parseInt(this.cutHex(color), 16));
            this.viewer.impl.invalidate(false, false, true);
          } else {
            var material = this.addMaterial(color, id);
            let it = model.getData().instanceTree;
            it.enumNodeFragments(dbId, (fragId) => {
              var renderProxy = this.viewer.impl.getRenderProxy(model, fragId);
              renderProxy[id] = new THREE.Mesh(renderProxy.geometry, material);
              renderProxy[id].matrix.copy(renderProxy.matrixWorld);
              renderProxy[id].matrixWorldNeedsUpdate = true;
              renderProxy[id].matrixAutoUpdate = false;
              renderProxy[id].frustumCulled = false;
              this.viewer.impl.addOverlay(id, renderProxy[id]);
              this.viewer.impl.invalidate(true);
            }, false);
          }
        }
      }
    }
  }

  /**
   * @param {*} model
   * @param {number} dbId
   * @param {string} color
   * @memberof ViewerUtils
   */
  addTobDIdColor(model, dbId, color) {
    let mapColor, setDbId;
    if (!this.modelMap.has(model)) {
      mapColor = new Map();
      this.modelMap.set(model, mapColor);
    } else {
      mapColor = this.modelMap.get(model);
    }
    if (!mapColor.has(color)) {
      setDbId = new Set();
      mapColor.set(color, setDbId);
    } else {
      setDbId = mapColor.get(color);
    }
    setDbId.add(dbId);
  }

  /**
   * color in a overlay then remove automatically color after an user "click"
   * @param {{model, color: string, dbid: number}[]} items
   * @memberof ViewerUtils
   */
  colorItems(items) {
    for (const item of items) {
      this.addTobDIdColor(item.model, item.dbId, item.color);
    }
    this._setColorMaterial();
    window.addEventListener("click", this.restoreColorMaterialBinded, true);
  }

}
export const viewerUtils = new ViewerUtils();
