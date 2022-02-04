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

import { SpinalNode } from "spinal-model-graph";
import { FileSystem } from 'spinal-core-connectorjs_type'
import { ROOM_TYPE } from "../../constants";

async function getSurfaceFromNode(node: SpinalNode<any>)
{
  const surface = await findSurface(node);
  return surface.toFixed(2);
}

async function findSurface(node) : Promise<number>
{
  let area = 0;
  const info = FileSystem._objects[node.serverId];
  if (info === undefined)
  {
    return 0;
  }
  if (info.getType().get() === ROOM_TYPE) {
    let attr = await getAttrByKey(info, "area");
    return attr.value.get();
  }
  if (node.children === undefined)
  {
    return 0;
  }
  for (let [_, childList] of node.children)
  {
    for (let child of childList)
    {
      area += await findSurface(child);
    }
  }
  return area;
}

async function getAttrByKey(node, key) {
  if (node && node instanceof SpinalNode) {
    const cats = await node.getChildren("hasCategoryAttributes");
    for (const cat of cats) {
      const attrLst = await cat.getElement();
      for (let idx = 0; idx < attrLst.length; idx++) {
        const attr = attrLst[idx];
        if (attr.label.get() === key) {
          return attr;
        }
      }
    }
  }
}

module.exports = {
  getSurfaceFromNode: getSurfaceFromNode,
}