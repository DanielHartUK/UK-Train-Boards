import { shell } from 'electron';

export default {
  methods: {
    /**
     * Open a url in the default system browser
     *
     * @param {string} url The url to open
     */
    openExternal(url) {
      shell.openExternal(url);
    },
  },
};
