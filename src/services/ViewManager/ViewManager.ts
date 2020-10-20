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

export interface ISpinalView {
  name: string;
  serverId: number;
}
export type ViewManagerOnChangeFct = (view: ISpinalView) => void;
export type ViewManagerBreacrumbSubscribeFct = (breadcrumb: ISpinalView[]) => void;

export class ViewManager {
  static instances: Map<string, ViewManager> = new Map();
  viewKey: string;
  breadcrumb: ISpinalView[] = []
  onChangeFct: ViewManagerOnChangeFct = null;
  breacrumbSubscribeFct: ViewManagerBreacrumbSubscribeFct = null;

  constructor(viewKey) {
    this.viewKey = viewKey;
  }
  static getInstance(viewKey: string): ViewManager {
    if (!ViewManager.instances.has(viewKey))
      ViewManager.instances.set(viewKey, new ViewManager(viewKey))
    return ViewManager.instances.get(viewKey);
  }

  init(onChangeFct: ViewManagerOnChangeFct, serverId) {
    this.onChangeFct = onChangeFct;
    const view = { name: this.viewKey, serverId };
    this.breadcrumb = [view]
    if (this.onChangeFct) this.onChangeFct(view)
    if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
  }

  push(name: string, serverId: number) {
    const view = { name, serverId };
    this.breadcrumb.push(view);
    if (this.onChangeFct) this.onChangeFct(view)
    if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
  }

  breacrumbSubscribe(fct: ViewManagerBreacrumbSubscribeFct) {
    this.breacrumbSubscribeFct = fct;
  }

  move(serverId: number) {
    for (var i = this.breadcrumb.length - 1; i >= 0; i--) {
      const bc = this.breadcrumb[i];
      if (bc.serverId === serverId) {
        if (this.onChangeFct) this.onChangeFct(bc)
        if (this.breacrumbSubscribeFct) this.breacrumbSubscribeFct(this.breadcrumb)
        return;
      } else
        this.breadcrumb.pop();
    }
  }

}