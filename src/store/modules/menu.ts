const state = {
  root: {
    id: 0,
    name: ''
  },
  roots: [],
  resources: [],
};
const getters = {
  getMenuRoot: state => state.root,
  getMenuRoots: state => state.roots,
  getMenuResource: state => state.resources,
};
const actions = {
  setMenuRoot({commit, state}, payload) {
    commit('setMenuRoot', payload)
  },
  setMenuRoots({commit, state}, payload) {
    commit('setMenuRoots', payload)
  },
  setMenuResource({commit, state}, payload) {
    commit('setMenuResource', payload)
  },
};
const mutations = {
  setMenuRoot(state, payload) {
    state.root = payload
  },
  setMenuRoots(state, payload) {
    state.roots = payload
  },
  setMenuResource(state, payload) {
    state.resources = payload
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}
