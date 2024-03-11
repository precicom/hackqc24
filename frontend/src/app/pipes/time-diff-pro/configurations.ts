import { TranslateService } from '@ngx-translate/core'

export type TimeDiffFormats = 'hh:mm:ss'

export type TimeDiffCategories = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'now'
export interface TimeDiffDefinitionMap {
  [timeCategory: string]: TimeDiffDefinition
}
export interface TimeDiffParameters {
  to?: Date
  timeCategories?: Array<TimeDiffCategories>
  configuration?: TimeDiffDefinitionMap
  format?: TimeDiffFormats
}

export interface TimeDiffDefinition {
  threshold?: number // units normalized in days. (ex: 1 month = 30 units, 1 hour = 1/24 units)
  useSingularCustomText?: boolean // if true, will render for example: 'Last month' instead of '1 month ago'.
  usePluralCustomText?: boolean // if true, will render for example: 'More than a month ago' instead of '4 months ago'
  singularTranslation?: (translate: TranslateService) => string
  pluralTranslation?: (translate: TranslateService, qty: number) => string
  singularCustomTranslation?: (translate: TranslateService) => string
  pluralCustomTextTranslation?: (translate: TranslateService) => string
  isSingular?: (elapsedDays: number) => boolean // callback to use to determine if the quantity is considered singular
  quantity?: (elapsedDays: number) => number // callback to determine the quantity for the given type (1 week, 2 month, 5 years...)
}

export const defaultDefinitions = new Map<string, TimeDiffDefinition>()

// default definition
defaultDefinitions.set('years', {
  threshold: 365,
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.year_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.years_ago', { years: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.last_year'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_year_ago'),
  isSingular: (elapsedDays: number) => elapsedDays / 365 < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays / 365),
})
defaultDefinitions.set('months', {
  threshold: 30,
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.month_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.months_ago', { months: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.last_month'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_month_ago'),
  isSingular: (elapsedDays: number) => elapsedDays / 30 < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays / 30),
})
defaultDefinitions.set('weeks', {
  threshold: 7,
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.week_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.weeks_ago', { weeks: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.last_week'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_week_ago'),
  isSingular: (elapsedDays: number) => elapsedDays / 7 < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays / 7),
})
defaultDefinitions.set('days', {
  threshold: 1,
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.day_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.days_ago', { days: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.yesterday'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_day_ago'),
  isSingular: (elapsedDays: number) => elapsedDays < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays),
})
defaultDefinitions.set('hours', {
  threshold: 1 / 24, // threshold must be expressed in unit days, that's why it is divided by 24
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.hour_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.hours_ago', { hours: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.last_hour'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_hour_ago'),
  isSingular: (elapsedDays: number) => elapsedDays * 24 < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays * 24),
})
defaultDefinitions.set('minutes', {
  threshold: 1 / 24 / 60, // threshold must be expressed in unit days, that's why it is divided by (24 / 60)
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.minute_ago'),
  pluralTranslation: (translate, qty) => translate.instant('shared.time.minutes_ago', { minutes: qty }),
  singularCustomTranslation: translate => translate.instant('shared.time.last_minute'),
  pluralCustomTextTranslation: translate => translate.instant('shared.time.more_than_a_minute_ago'),
  isSingular: (elapsedDays: number) => elapsedDays * 24 * 60 < 2,
  quantity: (elapsedDays: number) => Math.floor(elapsedDays * 24 * 60),
})
defaultDefinitions.set('now', {
  threshold: 0,
  useSingularCustomText: false,
  usePluralCustomText: false,
  singularTranslation: translate => translate.instant('shared.time.just_now'),
  singularCustomTranslation: translate => translate.instant('shared.time.just_now'),
  isSingular: (elapsedDays: number) => true,
  quantity: (elapsedDays: number) => 0,
})

export const defaultTimeCategories: Array<TimeDiffCategories> = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'now']

// Used in timeDiffPro pipe as default configurations for convenience and performance
export const defaultConfiguration = {
  years: defaultDefinitions.get('years'),
  months: defaultDefinitions.get('months'),
  weeks: defaultDefinitions.get('weeks'),
  days: defaultDefinitions.get('days'),
  hours: defaultDefinitions.get('hours'),
  minutes: defaultDefinitions.get('minutes'),
  now: defaultDefinitions.get('now'),
}

// utility method to merge custom definitions with default definitions
export function mergeConfiguration(
  customDefinitions: TimeDiffDefinitionMap,
  timeCategories: Array<TimeDiffCategories> = defaultTimeCategories,
): TimeDiffDefinitionMap {
  const newDefinitions: TimeDiffDefinitionMap = {}
  timeCategories.forEach(timeCategory => {
    const customCategoryDefinition = customDefinitions[timeCategory] || {}
    newDefinitions[timeCategory] = { ...defaultDefinitions.get(timeCategory), ...customCategoryDefinition }
  })

  return newDefinitions
}
