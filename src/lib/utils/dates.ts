import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

export const formatPromoDate = (date: Date) => dayjs(date).format('dddd, MMM Do, YYYY h:mma')

export const formatPromoTableDate = (date: Date) => dayjs(date).format('h:mm a\ndddd\nMMM Do, YYYY')

export const formatDateInput = (date: Date | string) => dayjs(date).format('YYYY-MM-DDTHH:mm')
