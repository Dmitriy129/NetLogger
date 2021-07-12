import NetMonitor from "../server/NetMonitor";
import { PingResponse } from "./NetMonitor";

export interface ServerStoreStateRecord {
    id: string
    data: PingResponse
    createdAt: string
}
export type ServerStoreStateRecordsList = Map<ServerStoreStateRecord["id"], ServerStoreStateRecord>
export interface NetMonitorData {
    id: NetMonitor["id"]
    address: NetMonitor["address"]
    title: NetMonitor["title"]
    interval: NetMonitor["interval"]
    launched: NetMonitor["launched"]
    count: NetMonitor["count"]
    recordsList: ServerStoreStateRecordsList
}

export type ServerStoreState = Map<NetMonitor["id"], NetMonitorData>

export interface IServerStore {
    state: ServerStoreState

    add: (monitor: NetMonitor, data: PingResponse) => Promise<ServerStoreStateRecord>
    read: (monitorId: NetMonitor["id"]) => Promise<ServerStoreStateRecordsList | null>
    toJson: () => string
    saveToFile: () => Promise<void>
    readFromFile: () => void

    updateMonitor: (monitor: NetMonitor) => Promise<void>

}