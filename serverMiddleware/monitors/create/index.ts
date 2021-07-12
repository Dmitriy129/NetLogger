
import { ServerMiddleware } from '@nuxt/types';
import nmmanager from '../../../src/server/ManagerNetMonitors'
import NetMonitor from '../../../src/server/NetMonitor'


const f: ServerMiddleware = async function (req: any, res) {
    await nmmanager.add(new NetMonitor(req.body)).start()
    res.end()
}
export default f
