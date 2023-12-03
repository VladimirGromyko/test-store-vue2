<template>
  <div class="wrapper">
    <span class="goods-wrapper">
      <div class="header">
        <span>Курс:</span>
        <el-input
            v-model="rate"
            :formatter="(value) => `₽ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\₽\s?|(,*)/g, '')"
        />
      </div>
      <div class="demo-collapse">
        <el-collapse v-model="activeName" accordion @change="handleChange(activeName)">
          <el-collapse-item
              v-for="item in idNames"
              :key="item"
              :title="names[item]['G']"
              :name="item"
              :class="groupState(item)"
          >
            <span v-if="getGroupGoods.length">
              <span v-for="goods in getGroupGoods" :key="goods" class="goods">
                <span class="goods-record">
                  <span class="goods-name">{{recordName(goods)}}</span>
                  <el-button :type="goods['C_CANGE']" plain size="small" class="goods-price">
                    ₽ {{goods['C_RUB']}}
                  </el-button>
                  <span class="separator">|</span>
                  <el-button
                      type="primary"
                      class="goods-price"
                      :disabled="goods['PS']"
                      @click="addPurchase(goods)"
                  >
                    <ShoppingTrolley class="icon"/>
                    <span style="vertical-align: middle">Купить</span>
                  </el-button>
                </span>
              </span>
            </span>
          </el-collapse-item>
        </el-collapse>
      </div>
    </span>
    <span class="basket">
      <Timer @onRunFunction="setGoods"/>
      <Basket />
    </span>
  </div>
</template>

<script>
import dataGoods from '../assets/data.json';
import namesGoods from '../assets/names.json';
import ShoppingTrolley from "../assets/icons/shopping.svg";
import Timer from "./Timer.vue";
import Basket from "./Basket.vue";

export default {
  props: ["msg"],
  components: {
    Basket,
    ShoppingTrolley,
    Timer
  },
  data() {
    return {
      activeName: 0,
      rate: 75,
      goods: null,
      prevGoods: null,
      names: namesGoods,
      groupGoods: [],
    }
  },
  computed: {
    /**
     * Вычисляемая переменная idNames
     * @returns {string[]} - возвращает список ключей (id), являющихся ссылкой на группы товаров
     * Данные с ключами при этом выбираются из файла 'names.json'
     */
    idNames () {
      return Object.keys(this.names)
    },
    /**
     * getGroupGoods - Вычисляемая переменная - возвращает текущее значение переменной groupGoods (список групп товаров)
     * @returns {groupGoods[]}
     */
    getGroupGoods() {
      return this.groupGoods
    },

    /**
     * getPurchases - переменная-getter - возвращает список покупок из корзины ( из объекта store)
     * @returns {{purchases[]}}
     */
    getPurchases() {
      return this.$store.getters.getBasket.purchases
    },

    /**
     * changePurchases - переменная-getter - отслеживает и возвращает информацию о том что
     * с корзиной покупок что-то происходило: либо корзина пополнялась, либо товар удалялся из корзины.
     * @returns {boolean} - возвращает состояние изменения данных в корзине true|false -
     * здесь не важно какое состояние изменения (true или false) - главное, что изменение произошло
     */
    changePurchases(){
      return this.$store.getters.getChangePurchases
    }
  },
  watch: {
    /**
     * Фунция rate - отслеживает изменения курса валюты и вызывает различные действия:
     * вызов функции запоминания предыдущего значения товарных остатков и цен товаров,
     * вызов функции изменения цен товаров,
     * вызов функции изменения данных по ценам у текущей выбранной товарной группы,
     * вызов фунции для обновления цен товаров в корзине в зависимости от изменившегося курса валюты.
     * @param newVal - получает и контролирует текущее значение курса валюты
     */
    rate(newVal) {
      this.setPrevGoods()
      this.updateCost()
      this.handleChange(this.activeName)
      this.$store.dispatch("updateCurrency", +newVal)
    },

    /**
     * Функция goods - отслеживает изменения состояния складских остатков и цен товаров и вызывает различные действия:
     * вызов функции изменения цен товаров,
     * вызов функции изменения данных по ценам у текущей выбранной товарной группы,
     * вызов фунции для обновления цен товаров в корзине в зависимости от изменившихся валютных цен и курса валюты.
     * @param newGoods - получает и контролирует текущее значение переменной с данными о товарных остатках и ценах
     */
    goods(newGoods){
      this.updateCost()
      this.handleChange(this.activeName)
      this.$store.dispatch("updateData", { newGoods, newRate: +this.rate})
    },

    /**
     * Функция - changePurchases отслеживает изменение состояния переменной 'changePurchases', хранящейся
     * в store и содержащую контрольную информацию о движении покупок в/из корзину  и вызывает различные действия:
     * вызов функции контроля за остатками товара на складе и в корзине
     * вызов функции изменения данных по ценам у текущей выбранной товарной группы,
     * @param newVal - получает и контролирует текущее значение переменной 'changePurchases'
     */
    changePurchases(newVal){
      this.purchasesControl()
      this.handleChange(this.activeName)
    }
  },
  beforeMount() {
    // На стадии жизненного цикла "Перед монтировкой в DOM" - вызываем функции для заполнения данных.
    this.setGoods()
    this.updateCost()
  },
  methods: {
    /**
     * Функция setGoods - формирует копию значений товарных остатков для внутренней переменной 'goods',
     * взятых из файла 'data.json'. Одновременно устанавливает свое предыдущее значение в переменную 'prevGoods'
     * и вызывает фукцию контроля остатков
     */
    setGoods() {
      this.setPrevGoods()
      this.goods = JSON.parse(JSON.stringify(dataGoods.Value.Goods))
      this.purchasesControl()
    },

    /**
     * Функция setPrevGoods устанавливает предыдущее значение переменной 'goods' в переменную 'prevGoods' для
     * возможности контроля за остатками товара между складом и корзиной
     */
    setPrevGoods() {
      this.prevGoods = this.goods ? JSON.parse(JSON.stringify(this.goods)) : this.goods
    },

    /**
     * Функция handleChange - формирует список товарных позиций в выбранной группе товаров
     * @param group - принимает в качестве параметра - id номер группы
     */
    handleChange(group) {
      this.groupGoods = this.goods.filter((el) => el['G'] === +group)
    },

    /**
     * Функция updateCost - заполняет и обновляет данные в переменной 'goods'? содержащей информацию об
     * остатках товаров и ценах.
     * Добавляются и обновляются данные о цене в RUB, а также о повышении/понижении цены в RUB в зависимости от
     * курса валюты или изменении валютной цены для товарной позиции на складе
     */
    updateCost() {
      this.goods.forEach((el) => {
        el['C_RUB'] = +(el['C'] * this.rate).toFixed(1)
        el['C_CANGE'] = ''
          if (this.prevGoods){
            for(let i = 0; i < this.prevGoods.length; i++){
              if (el['T'] === this.prevGoods[i]['T']) {
                if (el['C_RUB'] < this.prevGoods[i]['C_RUB']) {
                  el['C_CANGE'] = 'success'
                } else if (el['C_RUB'] > this.prevGoods[i]['C_RUB']) {
                  el['C_CANGE'] = 'danger'
                }
              }
            }
          }
      })
    },

    /**
     * Функция groupState - возвращает значение наличия/отсутствия товарных позиций в товарной группе
     * @param item - принимает в качестве параметра - id номер группы товаров
     * @returns {string} - возращает наличие товаров (full) или отсутствие товаров (empty) в товарной группе
     * Необходима для установления цвета (черный/серый) аккордеон-вкладки с  названиями товарных групп
     */
    groupState(item){
      const goods = this.goods.filter((el) => el['G'] === +item)
      return goods.length ? "full" : "empty"
    },

    /**
     * Функция recordName - формирует текстовую строку с названием товара и его остатками на складе
     * @param val - принимает в качестве параметра товарную позицию из текущей товарной группы
     * @returns {number|string} - возвращает сформированную строку
     */
    recordName(val) {
      const names = this.names
      return this.activeName && `${names[this.activeName]['B'][val['T']]['N']} (${val['P']})`
    },

    /**
     * Функция addPurchase - добавляет выбранный товар в корзину
     * @param item - принимает в качестве параметра выбранную товарную позицию для отправки во внутренний store
     */
    addPurchase(item) {
      const names = this.names
      const goods = {
        groupName: names[item['G']]['G'],
        groupId: item['G'],
        product: names[item['G']]['B'][item['T']]['N'],
        productId: item['T'],
        price: item['C_RUB'],
        priceCurrency: item['C'],
        priceChange: item['C_CANGE'],
        quantity: 1,
        cost: item['C_RUB'],
        rate: +this.rate
      }
      this.$store.dispatch("addGoods", goods)

      // Измененяем состояния покупок для дальнейшего контроля за остатками товара
      this.$store.dispatch("changePurchases", !this.changePurchases)
    },

    /**
     * Функция purchasesControl - осуществляет контроль за остатками товара на складе и в корзине - больше чем
     * имеется на складе купить нельзя
     */
    purchasesControl() {
      const purchases = this.getPurchases
      this.goods.forEach((el) => {

        // Для контроля состояния покупок вводим поле 'PS' - Purchases State с состоянием true/false -
        // в обратной зависимости от того, имеется ли на складе товар для продажи или весь имеющийся товар
        // уже в корзине (true - весь имеющийся товар в корзине, false - что-то еще осталось на складе)
        el['PS'] = !el['P']
        if (purchases.length) {
          for (let i = 0; i < purchases.length; i++) {
            if (el['T'] === purchases[i].productId) {
              if (el['P'] === purchases[i].quantity) {
                el['PS'] = true
              } else {
                el['PS'] = false
              }
            }
          }
        }
      })
    },
  },
}
</script>


<style lang="scss" scoped>
.wrapper{
  display: flex;
  margin: 20px;
  gap: 50px;
}
.header{
  padding: 20px 10px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  .el-input{
    max-width: 100px;
  }
}
.goods-wrapper, .basket{
  display: flex;
  flex-direction: column;
  max-width: 620px;
}
.demo-collapse{
  min-width: 580px;
}
.goods {
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #fafafa;
}
.goods-record{
  display: flex;
  align-items: center;
  padding: 2px 0 2px 20px;
}
.goods-name{
  display: flex;
  width: 350px;
  line-height: 1.3;
  cursor: pointer;
}
.goods-price{
  width: 90px;
  height: 24px;
}
.separator{
  padding: 0 5px 0 10px;
  font-size: 18px;
  color: #b1b1b1;
}
.icon{
  padding: 0 10px 0 0;
}
</style>
<style>
.el-collapse-item__header{
  flex-direction: row-reverse;
  justify-content: flex-end;
  padding-left: 10px;
}
.el-collapse-item__arrow {
  margin: 0 8px 0 0
}
.el-collapse {
  border-left: 1px solid var(--el-collapse-border-color);
  border-right: 1px solid var(--el-collapse-border-color);
  --el-collapse-header-bg-color: 'none';
}
.el-collapse .empty{
  --el-collapse-header-text-color: #a8a8a8;
}
.full .el-collapse-item__wrap{
  border-bottom: none;
}
.el-collapse-item__content{
  padding-bottom: 0;
}
.el-collapse-item.light {
    background: #ffffff;
}
.el-collapse-item.full, .el-collapse-item.empty {
    background: #fafafa;
}
</style>
