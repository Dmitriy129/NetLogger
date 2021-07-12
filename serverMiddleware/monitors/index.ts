import { ServerMiddleware } from '@nuxt/types'
import ServerStore from '../../src/server/ServerStore'


const f: ServerMiddleware =  function (_req, res) {
    res.end( ServerStore.toJson())

}
export default f
