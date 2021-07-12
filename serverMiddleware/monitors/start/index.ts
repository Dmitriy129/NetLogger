import { ServerMiddleware } from '@nuxt/types'
import nmmanager from '../../../src/server/ManagerNetMonitors'

const f: ServerMiddleware = function (_req, res) {
    nmmanager.startAll()
    res.end()
}
export default f
