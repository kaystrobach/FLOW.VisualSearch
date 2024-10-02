import globals from "globals";
import pluginJs from "@eslint/js";

import { configs as configsWc } from "eslint-plugin-wc"
import { configs as configsLit } from "eslint-plugin-lit"

export default [
    configsWc["flat/recommended"],
    configsLit["flat/recommended"],

    {
        languageOptions: {
          globals: globals.browser
        }
    },

    pluginJs.configs.recommended,
];