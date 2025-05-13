import globals from 'globals'
import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parser: vue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      vue
    },
    rules: {
      ...vue.configs.recommended.rules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-model-argument': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
]