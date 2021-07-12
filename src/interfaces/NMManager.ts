import { INetMonitor, Config } from "./NetMonitor";
export interface INMManager {
    monitors: Map<INetMonitor["id"], INetMonitor>
    add: (monitor: INetMonitor | Config) => INetMonitor
    startAll: () => void
    restartAll: () => void
    stopAll: () => void
}
