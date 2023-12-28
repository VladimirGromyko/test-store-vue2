const actions = {
    addGoods({commit}, goods) {
        commit("ADD_TO_BASKET", goods);
    },
    delGoods({commit}, goods) {
        commit("DELETE_FROM_BASKET", goods);
    },
    updateBasket({commit}, payload) {
        commit("UPDATE_BASKET", payload);
    },
    changePurchases({commit}, change){
        commit("CHANGE_PURCHASES", change)
    }
}
export default actions;
