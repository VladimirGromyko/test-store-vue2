<template>
  <div class="header">
    <span>Обновление через:</span>
    <span style="width: 60px">{{ time }}</span>
    <span @click="restartTimer">
      <el-icon style="vertical-align: middle">
        <Update style="color: #409eff"/>
      </el-icon>
    </span>
  </div>
</template>

<script>

import Update from "../assets/icons/update.svg";

export default {
  name: "Timer",
  components: { Update },
  data() {
    return {
      timerValue: 15,
      time: `${this.timerValue}:000`,
      intervalId: null,
      timersNumber: [],
    }
  },
  mounted() {
    /**
     * При первоначальной загрузке вызываем таймер обратного отсчета
     */
    this.startTimer(this.timerValue)
  },
  methods: {
    /**
     * startTimer - функция для запуска таймера обратного отсчета
     * @param startValue - входным параметром принимает число в секундах, как начало отсчета
     * по окончанию работы запускает функцию restartTimer для повторного запуска таймера
     */
    startTimer(startValue) {
      let countDownDate = new Date().getTime() + startValue*1000;
      this.intervalId = setInterval(() => {
        let now = new Date().getTime();
        let distance = countDownDate - now;

        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        let milliseconds = distance % 1000;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds =
            milliseconds < 10
                ? "00" + milliseconds
                : milliseconds < 100
                    ? "0" + milliseconds
                    : milliseconds;

        this.time = `${seconds}:${milliseconds}`;

        if (distance <= 0) {
          this.restartTimer()
        }
      }, 1);
      this.timersNumber.push(this.intervalId)
    },
    /**
     * restartTimer() - функция для обновления данных и повторного запуска таймера.
     * Вызывает функцию обновления данных (эмитит событие для обновления данных в родительскую компоненту)
     * Делает небольшую задержку - 300мс для большей наглядности перезапуска, а затем повторно запускает таймер
     */
    restartTimer() {
      this.$emit('onRunFunction')
      this.timersNumber.forEach((el) => clearInterval(el))
      this.time = "00:000";
      setTimeout(() => {
        this.time = `${this.timerValue}:000`;
        this.startTimer(this.timerValue);
      }, 300)
    },
  }
}
</script>

<style scoped>
.header{
  padding: 20px 10px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  line-height: 32px;
  color: #909399;
}
</style>
