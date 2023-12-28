const mutations = {

    // Добавляем товар в корзину
    ADD_TO_BASKET(state, goods) {
        const purchases = state.basket.purchases
        if (purchases.length === 0) {
            purchases.push(goods);
        } else {
            const productInd = purchases.findIndex((el) => el.productId === goods.productId)
            if (productInd >= 0) {
                purchases[productInd].quantity++
                purchases[productInd].cost = +(purchases[productInd].quantity * purchases[productInd].price).toFixed(1)
            } else {
                purchases.push(goods);
            }
        }
        state.basket.totalCost = (+state.basket.totalCost + goods.price).toFixed(1)
    },

    // Удаляем товар из корзины
    DELETE_FROM_BASKET(state, goods) {
        let purchases = state.basket.purchases
        const productInd = purchases.findIndex((el) => el.productId === goods.productId)
        if (productInd >= 0 && purchases[productInd].quantity > 1) {
            purchases[productInd].quantity--
            purchases[productInd].cost =
                +(purchases[productInd].quantity * purchases[productInd].price).toFixed(1)
        } else if (productInd >= 0 && purchases[productInd].quantity === 1) {
            state.basket.purchases = purchases.filter((el) => el.productId !== purchases[productInd].productId)
        }
        state.basket.totalCost = (+state.basket.totalCost - goods.price).toFixed(1)
    },

    // Обновляем данные в корзине покупок, в связи с изменением цены конкретного товара или курса валюты
    UPDATE_BASKET(state, newData) {
        state.basket = newData
    },

    // Изменяем состояние о перемещениях в/из корзину/ы
    CHANGE_PURCHASES(state, change){
        state.changePurchases = change
    }
}
export default mutations;
