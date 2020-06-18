<template>
  <div class="Settings Page TwelveColumns">
    <h1>{{ $t('Settings') }}</h1>
    <form
      class="TwelveColumnsFlex"
      @submit.prevent="submitSettings"
    >
      <div class="FormItem Column Column--12">
        <label
          for="api-key-field"
          class="FormItem__Label"
        >
          {{ $t('API Key') }} -
          <a
            href="#"
            @click.prevent="openExternal('http://realtime.nationalrail.co.uk/OpenLDBWSRegistration/')"
          >
            {{ $t('Register') }}
          </a>
        </label>
        <input
          id="api-key-field"
          class="FormItem__Input"
          type="text"
          v-model="form.apiKey"
          required="true"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
      </div>
      <div class="FormItem Column Column--12">
        <input
          class="Button"
          type="submit"
          :value="$t('Save')"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { ipcRenderer, shell } from 'electron';

export default {
  name: 'Settings',

  data: () => ({
    form: {
      apiKey: null,
    },
  }),

  mounted() {
    ipcRenderer.on('get-settings', this.receiveSettings);
    ipcRenderer.send('get-settings');
  },

  methods: {
    submitSettings() {
      ipcRenderer.send('save-settings', this.form);
    },
    receiveSettings(e, settings) {
      Object.keys(settings)
        .forEach((key) => {
          this.form[key] = settings[key];
        });
    },
    openExternal(url) {
      shell.openExternal(url);
    },
  },
};
</script>
