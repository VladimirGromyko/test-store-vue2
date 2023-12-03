<template>
  <div>
    <el-table :data="getBasket.purchases" stripe empty-text="Корзина пуста" class="basket">
      <el-table-column label="Раздел" width="130" >
        <template #default="scope">
          <el-button type="warning" size="small" plain class="group-name">
            {{scope.row.groupName}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="product" label="Товар" min-width="200" />
      <el-table-column prop="quantity" label="Количество" align="center" min-width="80">
        <template #default="scope">
          <el-button size="small">{{scope.row.quantity}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="Стоимость" align="center" min-width="120">
        <template #default="scope">
          <el-button :type="scope.row.priceChange" plain size="small" class="goods-price">
            ₽ {{scope.row.cost}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="Действие" min-width="60">
        <template #default="scope">
          <el-button type="danger" size="small" @click.prevent="delPurchase(scope.row)">
            <el-icon style="vertical-align: middle">
              <Delete/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="total-price">
      <div class="total-price__text">Общая стоимость:</div>
      <div>
        <span class="total-price__value">₽ {{totalCost(getBasket.totalCost)[0]}}.</span>
        <span class="total-price__fraction">{{totalCost(getBasket.totalCost)[1]}}</span>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: "Basket",
  computed: {
    /**
     * Функция-getter - возвращает объект basket - из store
     * @returns {{purchases: *, totalCost: *}}
     */
    getBasket () {
      const {purchases, totalCost} = this.$store.getters.getBasket
      return {purchases, totalCost}
    },
    /**
     * Вычисляемая переменная-getter - возвращает значение переменной changePurchases- из store
     * @returns {getChangePurchases}
     */
    changePurchases(){
      return this.$store.getters.getChangePurchases
    },
  },
  methods: {
    /**
     * Функция удаления товаров из корзины
     * @param item - в качестве параметра принимает товарную единицу (из массива товаров в корзине)
     * работает со store; диспачит action 'delGoods', который в дальнейшем мутирует store - удаляет из него товар item
     */
    delPurchase(item) {
      this.$store.dispatch("delGoods", item)
      this.$store.dispatch("changePurchases", !this.changePurchases)
    },
    /**
     * Функция totalCost - преобразовывает числовое значение в наглядное представление вида - 1,000,000.00
     * при этом знаки после '.' будут отображены отдельно (уменьшенным шрифтом)
     * @param value - в качестве параметра принимает числовое значение стоимости
     * @returns {string[]} - возвращает преобразованное значение в виде массива из 2х элементов
     */
    totalCost(value) {
      const totalCost = value.toString().split('.')
      totalCost[0] = totalCost[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      totalCost[1] = totalCost.length === 1
          ? '00'
          : totalCost[1].length < 2
              ? totalCost[1] + '0'
              : totalCost[1]
      return totalCost
    },
  },
}
</script>

<style lang="scss" scoped>
.total-price{
  display: flex;
  padding-top: 20px;
  flex-direction: column;
}
.total-price__text{
  padding-bottom: 5px;
  color: #909399;
}
.total-price__value {
  font-weight: bold;
  font-size: 22px;
}
.total-price__fraction {
  font-weight: bold;
  font-size: 16px;
}
</style>
<style lang="scss">
.group-name{
  width: 100px;
  span{
    white-space: normal;
    width: 90px;
    justify-content: center;
  }
}
</style>
