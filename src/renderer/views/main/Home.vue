<template>
  <div class="NewBoard Page">
    <h1 class="Page__Title">{{ $t('New Board') }}</h1>
    <form
      class="TwelveColumnsFlex"
      @submit.prevent="generateBoard"
    >
      <fieldset class="FormItem FormItem--Fieldset NewBoard__Boards Column Column--12">
        <legend class="FormItem__Label">{{ $t('Board') }}</legend>
        <div class="NewBoard__BoardContainer">
          <div
            v-for="(board, key) in boards"
            :key="key"
            class="RadioInputGroup NewBoard__Board"
          >
            <input
              :id="`${uuid}-${key}-board`"
              class="RadioInput"
              type="radio"
              name="board"
              :value="key"
              v-model="form.board"
              @change="boardChanged"
              required
            />
            <label :for="`${uuid}-${key}-board`">
              <div
                class="NewBoard__BoardImage"
                :class="{
                  'NewBoard__BoardImage--Vertical': board.type === 'vertical',
                  'NewBoard__BoardImage--Horizontal': board.type === 'horizontal'
                }"
                :style="{ backgroundImage: `url(${board.image})`}"
              />
              <span class="NewBoard__BoardName">{{ $t(board.name) }}</span>
            </label>
          </div>
        </div>
      </fieldset>
      <div
        v-for="(field, name) in boardFields"
        :key="`boardField-${name}`"
        class="FormItem"
        :class="field.class"
      >
        <label
          :for="`${uuid}-${name}-field`"
          class="FormItem__Label"
        >
          {{ $t(field.label) }}
        </label>
        <BoardFormInput
          v-model="form[name]"
          class="FormItem__Input"
          :id="`${uuid}-${name}-field`"
          :type="field.type"
          :required="field.required"
          :placeholder="field.placeholder"
          :modifier="field.modifier"
          v-bind="field.attributes"
        />
      </div>
      <div class="FormItem Column Column--12">
        <input
          v-tooltip="openButtonTooltip"
          class="Button"
          type="submit"
          :value="$t('Open')"
          :disabled="!apiKeySet"
        />
      </div>
    </form>
    <div class="Page__FooterCredits">
      <a
        v-if="selectedBoard.provider === 'nre'"
        href="#"
        class="ProviderLogo"
        @click.prevent="openExternal('https://www.nationalrail.co.uk/')"
      >
        <img src="/images/NRE.png" alt="Powered by National Rail Enquiries">
      </a>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import { mapState } from 'vuex';
import BoardFormInput from '@components/BoardFormInput';

function validateStation(value) {
  if (!value) return false;
  // @TODO Validate station code
  return true;
}

const commonFields = {
  location: {
    label: 'Location',
    class: 'Column Column--6',
    type: 'text',
    default: 'MAN',
    placeholder: 'MAN',
    required: true,
    validation: validateStation,
  },
  page: {
    label: 'Page',
    class: 'Column Column--3',
    type: 'number',
    modifier: 'number',
    default: 1,
    placeholder: '',
    attributes: {
      min: 0,
    },
    required: true,
  },
};

export default {
  name: 'Home',

  components: { BoardFormInput },

  data: () => ({
    boards: {
      departures: {
        name: 'Departures',
        image: '/images/departures.jpg',
        type: 'vertical',
        provider: 'nre',
        fields: {
          location: commonFields.location,
          page: commonFields.page,
        },
      },
      arrivals: {
        name: 'Arrivals',
        image: '/images/arrivals.jpg',
        type: 'vertical',
        provider: 'nre',
        fields: {
          location: commonFields.location,
          page: commonFields.page,
        },
      },
    },
    form: {
      board: 'departures',
    },
  }),

  computed: {
    ...mapState({
      settings: (state) => state.settings.settings,
    }),
    boardFields() {
      return this.boards[this.form.board]?.fields || {};
    },
    selectedBoard() {
      return this.boards[this.form.board];
    },
    apiKeySet() {
      if (this.settings?.[`${this.selectedBoard.provider}ApiKey`]) return true;

      return false;
    },
    openButtonTooltip() {
      const tooltip = {};

      if (!this.apiKeySet) tooltip.content = this.$t('API Key not set. Go to Settings to set one');

      return tooltip;
    },
  },

  mounted() {
    this.boardChanged();
  },

  methods: {
    /**
     * On selected board change, cleanup the form object
     */
    boardChanged() {
      const boardFieldNames = Object.keys(this.boardFields);

      Object.keys(this.form)
        .forEach((name) => {
          if (name === 'board') return;

          if (boardFieldNames.indexOf(name) === -1) {
            this.$delete(this.form, name);
          }
        });

      Object.keys(this.boardFields)
        .forEach((name) => {
          if (!this.form[name]) this.$set(this.form, name, this.boardFields[name].default);
        });
    },

    /**
     * Handle form submission
     */
    generateBoard() {
      const validatedFields = {};

      Object.keys(this.boardFields)
        .forEach((name) => {
          const validationFunc = this.boardFields[name]?.validation;
          if (typeof validationFunc === 'function') {
            validatedFields[name] = validationFunc(this.form[name]);
          }
        });

      ipcRenderer.send('open-board', this.form);
    },
  },
};
</script>

<style lang="scss">
  @use '@renderer/styles/main/pages/home.scss';
</style>
