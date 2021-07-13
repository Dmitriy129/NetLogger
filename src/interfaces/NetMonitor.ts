import { ExecException } from 'child_process'

export interface Config {
    address: string
    title: string
    interval?: number
    count?: number
    id?:string
}


export interface PingResponseSuccessData {
    transmitted: number
    received: number
    loss: number
    roundTrip: {
        min: number
        avg: number
        max: number
        mdev: number
    }
}
export interface PingResponseSuccess {
    success: true
    data: PingResponseSuccessData
}
export interface PingResponseErrored {
    success: false
    error: ExecException
}
export type PingResponse = PingResponseSuccess | PingResponseErrored


export type ListnerCallback = (data: PingResponse) => void

export type NetMonitorEventType =
    | "error"
    | "pinged"

export interface INetMonitor {
    id: string
    address: string
    title: string
    interval: number // ms
    count: number

    launched: boolean
    listners: {
        [key in NetMonitorEventType]: ListnerCallback
    }

    onPing: (heandler: ListnerCallback) => void
    ping: () => Promise<PingResponse>
    start: () => void
    stop: () => void

}
