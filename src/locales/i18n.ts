import { createI18n } from "vue-i18n";
import en from "@/locales/en.json"
import pt_br from "@/locales/pt-br.json"



function loadLocaleMessages() {
    const locales = [{ en: en }, { pt_br: pt_br }]
    const messages: { [key: string]: any } = {}
    locales.forEach(lang => {
        const key = Object.keys(lang)[0]
        if (key) {
            messages[key] = (lang as any)[key]
        }
    })
    return messages
}


export default createI18n({
    locale: "pt_br",
    fallbackLocale: "pt_br",
    legacy: false,
    messages: loadLocaleMessages()
})