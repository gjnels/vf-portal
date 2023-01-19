import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

export const formatPromoDate = (date: Date) => dayjs(date).format('dddd, MMM Do, YYYY h:mma')
