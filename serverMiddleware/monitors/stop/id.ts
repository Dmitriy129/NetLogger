import { ServerMiddleware } from '@nuxt/types'
import nmmanager from '../../../src/server/ManagerNetMonitors'

const f: ServerMiddleware = function (req, res) {
    const id = req.url?.slice(1)
    if (id) nmmanager.stop(id)
    res.end()
}
export default f
