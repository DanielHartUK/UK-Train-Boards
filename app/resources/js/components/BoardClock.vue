<template>
  <td
    class="clock"
    colspan="2"
  >
    {{ time.hours }}:{{ time.minutes }}:<span>{{ time.seconds }}</span>
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
