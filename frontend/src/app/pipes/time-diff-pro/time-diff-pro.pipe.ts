import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common'
import { defaultConfiguration, mergeConfiguration, TimeDiffParameters } from './configurations'
import { Subscription } from 'rxjs'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import moment from 'moment'

@UntilDestroy()
@Pipe({
  name: 'timeDiffPro',
  pure: false,
  standalone: true,
})
export class TimeDiffProPipe implements PipeTransform {
  datePipe = new DatePipe(this.translate.currentLang)
  onLangChange: Subscription
  onDefaultLangChange: Subscription

  constructor(private translate: TranslateService, private _ref: ChangeDetectorRef) {}

  transform(
    dateParam: string | Date | number,
    { to = new Date(), configuration = null, timeCategories, format = null }: TimeDiffParameters = {},
  ): string {
    if (!dateParam) {
      return null
    }

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
        this._ref.markForCheck()
      })
    }

    // subscribe to onDefaultLangChange event, in case the default language changes
    if (!this.onDefaultLangChange) {
      this.onDefaultLangChange = this.translate.onDefaultLangChange.subscribe(() => {
        this._ref.markForCheck()
      })
    }

    // custom configurations are merged into the default configurations
    configuration = configuration ? mergeConfiguration(configuration, timeCategories) : defaultConfiguration

    const fromDate: Date = this.normalizeToDateObject(dateParam)
    const toDate: Date = this.normalizeToDateObject(to)

    if (!fromDate || !toDate) return ''

    if (format === 'hh:mm:ss') {
      const time = this.elapsedMilliseconds(fromDate, toDate)
      const duration = moment.duration(time)

      const hours = Math.trunc(duration.asHours()).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
      const minutes = duration.minutes().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
      const seconds = duration.seconds().toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

      return `${hours}:${minutes}:${seconds}`
    } else {
      const days = this.elapsedDays(fromDate, toDate)

      for (const def of Object.values(configuration).sort((a, b) => b.threshold - a.threshold)) {
        if (days > def.threshold) {
          const isSingular: boolean = def.isSingular(days)
          const qty: number = def.quantity(days)

          if (isSingular) {
            return def.useSingularCustomText ? def.singularCustomTranslation(this.translate) : def.singularTranslation(this.translate)
          } else {
            return def.usePluralCustomText ? def.pluralCustomTextTranslation(this.translate) : def.pluralTranslation(this.translate, qty)
          }
        }
      }
    }
  }

  elapsedDays(from: Date, to: Date): number {
    const elapsedMilliseconds = to.getTime() - from.getTime()
    return elapsedMilliseconds / 1000 / 60 / 60 / 24 // return elapsed days
  }

  elapsedMilliseconds(from: Date, to: Date): number {
    const elapsedMilliseconds = to.getTime() - from.getTime()
    return elapsedMilliseconds
  }

  normalizeToDateObject(dateValue: string | Date | number): Date {
    if (dateValue instanceof Date) {
      return dateValue
    } else if (typeof dateValue === 'number') {
      return new Date(dateValue)
    } else if (typeof dateValue === 'string') {
      return new Date(dateValue)
    } else {
      return null
    }
  }
}
