
import { INMManager } from '../interfaces/NMManager'
import { Config } from '../interfaces/NetMonitor'
import NetMonitor from './NetMonitor'
import store from './ServerStore'


export class NMManager implements INMManager {
    monitors = new Map<NetMonitor["id"], NetMonitor>()

    constructor() {
        this.add = this.add.bind(this)
        this.startAll = this.startAll.bind(this)
        this.restartAll = this.restartAll.bind(this)
        this.stopAll = this.stopAll.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
    }

    add(data: NetMonitor | Config) {
        let monitor: NetMonitor
        if (data instanceof NetMonitor) {
            monitor = data
        }
        else { monitor = new NetMonitor(data) }
        this.monitors.set(monitor.id, monitor)

        // if (!monitor.launched) monitor.start()
        monitor.onPing((data) => {
            store.add(monitor, data)
        })
        monitor.onError((error) => {
            console.error(error);
        })
        return monitor
    }

    start(id: NetMonitor["id"]) {
        const monitor = this.monitors.get(id)
        if (monitor && !monitor.launched) {
            monitor.start()
            store.updateMonitor(monitor)
        }
    }

    stop(id: NetMonitor["id"]) {
        const monitor = this.monitors.get(id)
        if (monitor && monitor.launched) {
            monitor.stop()
            store.updateMonitor(monitor)
        }
    }

    startAll() {
        Array.from(this.monitors.keys()).forEach(this.start)
    }

    stopAll() {
        Array.from(this.monitors.keys()).forEach(this.stop)
    }

    restartAll() {
        this.stopAll()
        this.startAll()
    }

    initFromStore() {
        Array.from(store.state.values()).forEach(
            ({ address, title, interval, count, id, launched }) => {
                const monitor = new NetMonitor({ address, title, interval, count, id })
                if (launched) monitor.start()
                this.add(monitor)
            })
    }


}


const nmmanager = new NMManager()
nmmanager.initFromStore()
export default nmmanager