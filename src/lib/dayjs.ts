import 'dayjs/locale/th'

import dayjs from 'dayjs'
import buddhistEra from 'dayjs/plugin/buddhistEra'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(buddhistEra)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.locale('th')

export default dayjs
