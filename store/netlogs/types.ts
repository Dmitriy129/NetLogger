import { Mutation, Action } from "../types"
import { Config, INetMonitor, PingResponse } from "~/src/interfaces/NetMonitor"

export interface StateRecord {
    id: string
    data: PingResponse
    createdAt: string
}
export type StateRecordsList = Map<StateRecord["id"], StateRecord>
export interface NetMonitorData {
    id: INetMonitor["id"]
    address: INetMonitor["address"]
    title: INetMonitor["title"]
    interval: INetMonitor["interval"]
    launched: INetMonitor["launched"]
    recordsList: StateRecordsList
}

export interface State {
    loading: boolean,
    list: Map<INetMonitor["id"], NetMonitorData>
    viewConfig: {
        monitorId: INetMonitor["id"] | null
        count: number
        positionIdx: number
    }
}
/* mutations */
export type NetLogMutation<T> = Mutation<State, T>

export interface NetLogGetters {
    getMonitors: (state: State) => any[]
    getMonitorInfo: (state: State) => any
    getData: (state: State) => any
    getFullData: (state: State) => any
}

export interface NetLogMutations {
    setViewCount: NetLogMutation<State["viewConfig"]["count"]>
    moveViewPosition: NetLogMutation<State["viewConfig"]["positionIdx"]>
    setMonitorId: NetLogMutation<State["viewConfig"]["monitorId"]>
    setLoading: NetLogMutation<State["loading"]>
    saveLocalData: NetLogMutation<State["list"]>
}
export interface NetLogActions {
    loadData: Action<void, Promise<void>>
    startAllMonitors: Action<void, Promise<void>>
    stopAllMonitors: Action<void, Promise<void>>
    startMonitor: Action<State["viewConfig"]["monitorId"], Promise<void>>
    stopMonitor: Action<State["viewConfig"]["monitorId"], Promise<void>>
    createMonitor: Action<Config, Promise<void>>
}
