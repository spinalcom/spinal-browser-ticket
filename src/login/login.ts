/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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
import Axios from 'axios';

function saveLogin(login, password) {
  const encryptedHex = JSON.stringify({ username: login, password });
  window.localStorage.setItem('spinalhome_cfg', btoa(encryptedHex));
}

export function login(login, password) {
  const serverHost = window.location.origin;
  return Axios.get(`${serverHost}/get_user_id`, {
    params: {
      u: login,
      p: password,
    },
  }).then((response) => {
    let id = parseInt(response.data);
    if (id !== -1) {
      saveLogin(login, password);
      window.location = '/html/spinaltwin' + location.hash + location.search;
      return;
    }
    throw new Error('Identifiant ou mot de passe incorrect');
  });
}
