import route from 'ziggy';
import { Ziggy } from '../assets/js/ziggy';

/**
 * Create a trans function for Vue, which will help use Laravel's language strings in Vue
 */

Vue.prototype.trans = (string) => {
    const tran = _.get(window.i18n, string);

    if (!tran) {
        console.error(`Translation not found for: ${string}`);
    }

    return tran || string;
};

/**
 * Vue global mixins
 */
Vue.mixin({
    methods: {
        /**
         * Add Ziggy to Vue
         */
        route: (name, params, absolute) => route(name, params, absolute, Ziggy),
    },
});
