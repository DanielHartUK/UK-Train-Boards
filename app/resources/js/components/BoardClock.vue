<template>
  <td colspan="2">
    <div class="clock">
      <span
        v-for="(H, i) in time.hours"
        :key="`H-${i}`"
        class="clock__hours"
      >
        {{ H }}
      </span>
      <span>:</span>
      <span
        v-for="(m, i) in time.minutes"
        :key="`m-${i}`"
        class="clock__minutes"
      >
        {{ m }}
      </span>
      <span>:</span>
      <span
        v-for="(s, i) in time.seconds"
        :key="`s-${i}`"
        class="clock__seconds"
      >
        {{ s }}
      </span>
    </div>
  </td>
</template>

<script>
const moment = require('moment-timezone');

export default {
    name: 'BoardClock',

    data: () => ({
        interval: null,
        time: {},
    }),

    beforeMount() {
        this.interval = setInterval(() => {
            const time = moment()
                .tz('Europe/London');
            this.time = {
                hours: time.format('HH'),
                minutes: time.format('mm'),
                seconds: time.format('ss'),
            };
        }, 250);
    },
};
</script>
