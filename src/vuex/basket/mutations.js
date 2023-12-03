const mutations = {

    // Добавляем товар в корзину
    ADD_TO_BASKET(state, goods) {
        const purchases = state.basket.purchases
        let totalCost = 0
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
        purchases.forEach((el) => totalCost += el.cost)
        state.basket.totalCost = +totalCost.toFixed(1)

    },

    // Удаляем товар из корзины
    DELETE_FROM_BASKET(state, goods) {
        let totalCost = 0
        let purchases = state.basket.purchases
        const productInd = purchases.findIndex((el) => el.productId === goods.productId)
        if (productInd >= 0 && purchases[productInd].quantity > 1) {
            purchases[productInd].quantity--
            purchases[productInd].cost =
                +(purchases[productInd].quantity * purchases[productInd].price).toFixed(1)
        } else if (productInd >= 0 && purchases[productInd].quantity === 1) {
            state.basket.purchases = purchases.filter((el) => el.productId !== purchases[productInd].productId)
        }
        state.basket.purchases.forEach((el) => totalCost += el.cost)
        state.basket.totalCost = +totalCost.toFixed(1)

    },

    // Обновляем данные в корзине покупок, всвязи с изменением курса валюты
    UPDATE_CURRENCY(state, newRate) {
        let totalCost = 0
        const purchases = state.basket.purchases
        if (purchases.length) {
            purchases.forEach((el) => {
                const newPrice = +(el.priceCurrency * newRate).toFixed(1)
                if (newPrice < el.price) {
                    el.priceChange = 'success'
                } else if (newPrice > el.price) {
                    el.priceChange = 'danger'
                }
                el.rate = newRate
                el.price = newPrice
                el.cost = +(el.quantity * el.price).toFixed(1)
                totalCost += el.cost
            })
            state.basket.totalCost = totalCost.toFixed(1)
        }
    },

    // Обновляем данные в корзине покупок, всвязи с изменением цены товаров
    UPDATE_DATA(state, payload) {
        const newGoods = payload.newGoods
        const newRate = payload.newRate
        let totalCost = 0
        const purchases = state.basket.purchases
        if (purchases.length) {
            purchases.forEach((el) => {
                for (let i = 0; i < newGoods.length; i++){
                    if (el.productId === newGoods[i]['T']) {
                        const newPrice = +(newGoods[i]['C'] * newRate).toFixed(1)
                        if (newPrice < el.price) {
                            el.priceChange = 'success'
                        } else if (newPrice > el.price) {
                            el.priceChange = 'danger'
                        }
                        el.priceCurrency = newGoods[i]['C']
                        el.rate = newRate
                        el.price = newPrice
                        el.cost = +(el.quantity * el.price).toFixed(1)
                        totalCost += el.cost
                    }
                }
            })
            state.basket.totalCost = totalCost.toFixed(1)
        }
    },

    // Изменяем состояние о перемещениях в/из корзину/ы
    CHANGE_PURCHASES(state, change){
        state.changePurchases = change
    }
}
export default mutations;
