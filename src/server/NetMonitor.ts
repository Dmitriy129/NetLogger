import * as cp from 'child_process'
import { v4 as uuidv4 } from 'uuid'
import { Config, INetMonitor, ListnerCallback, PingResponse } from '../interfaces/NetMonitor'
import api from './api'

class NetMonitor implements INetMonitor {
    id = uuidv4()
    launched = false
    listners = {
        "error": (data: PingResponse) => { console.error(data) },
        "pinged": (data: PingResponse) => { console.log(data) },
    }

    address = "localhost"
    interval = 10 * 60 * 1000 // every 10 min
    count = 10
    title = "localhost #default#"
    private timer: NodeJS.Timer | null = null

    constructor(
        config: Config
    ) {

        this.address = config.address
        this.title = config.title
        this.interval = config.interval || this.interval
        this.count = config.count || this.count
        this.id = config.id || this.id

        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.ping = this.ping.bind(this)
    }


    start() {
        this.ping()
        this.timer = setInterval(this.ping, this.interval)
        this.launched = true
    }

    stop() {
        clearInterval(this.timer as NodeJS.Timeout)
        this.timer = null
        this.launched = false
    }

    onPing(heandler: ListnerCallback) {
        this.listners.pinged = heandler
    }

    onError(heandler: ListnerCallback) {
        this.listners.error = heandler
    }

    ping() {
        return new Promise<PingResponse>((resolve) => {
            const command = `ping -c ${this.count} ${this.address}`
            cp.exec(command, (error: cp.ExecException | null, stdout: string): void => {
                if (error) {
                    console.error(`[NetMonitor]:\tcannot resolve ${this.address} \t ${this.title}`);
                    const result: PingResponse = {
                        success: false,
                        error
                    }
                    resolve(result)
                    return
                }
                const parsedResponse = api.parsePingResponce(stdout)
                const result: PingResponse = {
                    success: true,
                    data: parsedResponse
                }
                resolve(result)
            });
        })
            .then((res) => {
                this.listners.pinged(res)
                return res
            })

    }




}

export default NetMonitor