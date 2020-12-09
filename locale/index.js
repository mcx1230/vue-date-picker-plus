import Vue from 'vue'

import Format from './format'

import zhLocale from './lang/zh-CN'
import enLocale from './lang/en-US';
import zhCnLocale from 'view-design/src/locale/lang/zh-CN';
import enUsLocale from 'view-design/src/locale/lang/en-US';

const format = Format(Vue)

const messages = {
    'zh-CN': Object.assign(zhCnLocale, zhLocale),
    'en-US': Object.assign(enUsLocale, enLocale)
};

let lang = zhLocale
let merged = false
let i18nHandler = function () {
    const vueI18n = Object.getPrototypeOf(this || Vue).$t
    if (typeof vueI18n === 'function' && !!Vue.locale) {
        if (!merged) {
            merged = true
            Vue.locale(Vue.config['lang'], messages)
        }
        return vueI18n.apply(this, arguments)
    }
}

export const t = function (path, options) {
    let value = i18nHandler.apply(this, arguments)
    if (value !== null && value !== undefined) return value

    const array = path.split('.')
    let current = lang

    for (let i = 0, j = array.length; i < j; i++) {
        const property = array[i]
        value = current[property]
        if (i === j - 1) return format(value, options)
        if (!value) return ''
        current = value
    }
    return ''
}

export const use = function (l) {
    lang = l || lang
}

export const i18n = function (fn) {
    i18nHandler = fn || i18nHandler
}

export default {use, t, i18n}
