import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true
          },
        dark: true,
        themes: {
          dark: {
            primary: colors.blue.darken1, // #E53935
            secondary: colors.blue.lighten4, // #FFCDD2
            accent: colors.indigo.base, // #3F51B5
            background: '#161616',
          },
          light: {
            primary: colors.red.darken1, // #E53935
            secondary: colors.red.lighten4, // #FFCDD2
            accent: colors.indigo.base, // #3F51B5
            background: colors.red.darken1,
          },
        },
      },
});
