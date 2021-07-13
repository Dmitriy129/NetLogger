
import * as fs from 'fs';
import { v4 as uudv4 } from 'uuid';
import { INetMonitor, PingResponse } from "src/interfaces/NetMonitor";
import { IServerStore, NetMonitorData, ServerStoreStateRecord, ServerStoreStateRecordsList } from "../interfaces/ServerStore";
import NetMonitor from "./NetMonitor";
import api from "./api";

class ServerStore implements IServerStore {
    state = new Map<NetMonitor["id"], NetMonitorData>()
    constructor() {
        this.add = this.add.bind(this)
        this.read = this.read.bind(this)
        this.readFromFile = this.readFromFile.bind(this)
        this.saveToFile = this.saveToFile.bind(this)
        this.beforeExit = this.beforeExit.bind(this)
        this.toJson = this.toJson.bind(this)


        this.readFromFile()
        setInterval(this.saveToFile, 60 * 60 * 1000) // every hour
    }

    add(monitor: NetMonitor, data: PingResponse) {
        return new Promise<ServerStoreStateRecord>((resolve) => {
            const newRecord: ServerStoreStateRecord = {
                id: uudv4(),
                data,
                createdAt: (new Date()).toString()

            }
            const monitorData = this.state.get(monitor.id)
            if (monitorData) {
                monitorData.recordsList.set(newRecord.id, newRecord)
                if (monitorData.recordsList.size > 1100)
                    monitorData.recordsList = new Map<ServerStoreStateRecord["id"], ServerStoreStateRecord>(Array.from(monitorData.recordsList.entries()).slice(-1000))
            }

            else this.state.set(monitor.id, {
                id: monitor.id,
                address: monitor.address,
                title: monitor.title,
                interval: monitor.interval,
                launched: monitor.launched,
                count: monitor.count,
                recordsList: new Map([[newRecord.id, newRecord]])
            })

            resolve(newRecord)
        });
    }

    read(monitorId: NetMonitor["id"]) {
        return new Promise<ServerStoreStateRecordsList | null>((resolve) => {
            const monitor = this.state.get(monitorId)
            resolve(monitor?.recordsList || null)
        });
    }

    readFromFile() {
        try {
            const sData = (fs.readFileSync('serverStore.json')).toString();
            this.state = new Map<NetMonitor["id"], NetMonitorData>(
                JSON.parse(sData).
                    map(([monitorId, monitorData]: [NetMonitor["id"], NetMonitorData]) =>
                        [monitorId,
                            {
                                ...monitorData,
                                recordsList: new Map<ServerStoreStateRecord["id"], ServerStoreStateRecord>(monitorData.recordsList)
                            }
                        ]
                    )
            )
            console.log('[STORE]:\treaded from "serverStore.json" ');

        } catch (err) {
            console.log('[STORE]:\tnot readed from "serverStore.json" ');

        }
    }

    saveToFile() {
        console.log('[STORE]:\tServerStore saved to "serverStore.json"', new Date());
        return api.saveJSONtoFile(this.toJson(), "serverStore.json")
    }

    beforeExit() {
        api.saveJSONtoFileSync(this.toJson(), "serverStore.json")
        console.log('[STORE]:\tServerStore saved to "serverStore.json"', new Date());

    }

    toJson() {
        return JSON.stringify(Array.from(this.state)
            .map(([monitorId, monitorData]: [NetMonitor["id"], NetMonitorData]) =>
                [monitorId,
                    {
                        ...monitorData,
                        recordsList: Array.from(monitorData.recordsList)
                    }
                ]
            ))
    }


    updateMonitor(monitor: INetMonitor) {
        return new Promise<void>((resolve,) => {
            const lastMonitorData = this.state.get(monitor.id)
            if (lastMonitorData)
                this.state.set(monitor.id,
                    {
                        id: monitor.id,
                        address: monitor.address,
                        title: monitor.title,
                        interval: monitor.interval,
                        launched: monitor.launched,
                        count: monitor.count,
                        recordsList: lastMonitorData.recordsList
                    })
            resolve()
        });
    }
}

const store = new ServerStore()

export default store



process.stdin.resume();
function exitHandler(
    options: {
        cleanup?: boolean
        exit?: boolean
    },
    exitCode: number
): void {
    if (options.cleanup) console.log('clean')
    if (exitCode || exitCode === 0) console.log("code: ", exitCode);
    if (options.exit) process.exit()
    store.beforeExit()
}
process.on('exit', exitHandler.bind(null, { cleanup: true }));
process.on('SIGINT', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));