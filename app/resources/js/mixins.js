import route from 'ziggy';
import { Ziggy } from './routes';

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
         *
         * @param {String} name Route name.
         * @param {Object} params Route params.
         * @param {Boolean} absolute Return absolute url.
         * @return {String} URL for the route.
         */
        route: (name, params = null, absolute = false) => route(name, params, absolute, Ziggy),
    },
});
