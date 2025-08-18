import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"
import { locales } from './config'

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale || 'en'
  if (!locales.includes(locale as any)) notFound()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

