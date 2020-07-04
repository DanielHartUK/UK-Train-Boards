/* eslint-disable no-shadow */

// initial state
const state = {
  settings: {},
};

// getters
const getters = {
  settings: (state) => state.settings,
};

// actions
const actions = {
  setSettings({ commit }, payload) {
    commit('setSettings', payload);
  },
};

// mutations
const mutations = {
  setSettings(state, payload) {
    state.settings = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
