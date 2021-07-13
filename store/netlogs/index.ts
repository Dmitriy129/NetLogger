
import { State, NetMonitorData, NetLogGetters, NetLogMutations, NetLogActions, StateRecord } from "./types"
import { INetMonitor } from "~/src/interfaces/NetMonitor"

export const state = (): State => ({
  loading: false,
  list: new Map<INetMonitor["id"], NetMonitorData>(),
  viewConfig: {
    monitorId: "6e59827d-e5f9-4bec-83fe-30dd347ef109",
    count: 20,
    positionIdx: 0
  }
})

interface DataCollection {
  labels: string[]
  datasets: ({
    label: string
    borderColor?: string
    backgroundColor?: string
    data: number[]
  } | null)[]
}

interface ParserOptions {
  transmitted?: boolean,
  received?: boolean,
  loss?: boolean,
  stddev?: boolean,
  min?: boolean,
  avg?: boolean,
  max?: boolean,
}

const parseRecords = (records: StateRecord[], options: ParserOptions = {
  transmitted: true,
  received: true,
  loss: true,
  stddev: true,
  min: true,
  avg: true,
  max: true,
}) => {
  const dataCollection: DataCollection = {
    labels: [],
    datasets: [null, null, null, null, null, null, null]
  }
  if (options.transmitted) dataCollection.datasets[0] = ({ label: "transmitted", data: [], borderColor: "#aa00ff", backgroundColor: "#aa00ff" })
  if (options.received) dataCollection.datasets[1] = ({ label: "received", data: [], borderColor: "#536dfe", backgroundColor: "#536dfe" })
  if (options.loss) dataCollection.datasets[2] = ({ label: "loss", data: [], borderColor: "red", backgroundColor: "red" })
  if (options.stddev) dataCollection.datasets[3] = ({ label: "stddev", data: [], borderColor: "#00c853", backgroundColor: "#00c853" })
  if (options.min) dataCollection.datasets[4] = ({ label: "min", data: [], borderColor: "#c6ff00", backgroundColor: "#c6ff00" })
  if (options.avg) dataCollection.datasets[5] = ({ label: "avg", data: [], borderColor: "#536dfe", backgroundColor: "#536dfe" })
  if (options.max) dataCollection.datasets[6] = ({ label: "max", data: [], borderColor: "#ff9100", backgroundColor: "#ff9100" })

  for (const [index, record] of records.entries()) {
    const data = {
      transmitted: 0,
      received: 0,
      loss: 0,
      min: 0,
      avg: 0,
      max: 0,
      stddev: 0,
    }
    if (record.data.success === true) {

      data.transmitted = record.data.data.transmitted
      data.received = record.data.data.received
      data.loss = record.data.data.loss
      data.min = record.data.data.roundTrip.min
      data.avg = record.data.data.roundTrip.avg
      data.max = record.data.data.roundTrip.max
      data.stddev = record.data.data.roundTrip.stddev
    }
    {
      const dateArr = record.createdAt.split(" ")
      if (index === 0) {
        dataCollection.labels.push([dateArr[2], dateArr[1], dateArr[3]].join("/"))
      }
      else {
        const lastDateArr = records[index - 1].createdAt.split(" ")
        const lastDate = [lastDateArr[2], lastDateArr[1], lastDateArr[3]].join("/")
        const date = [dateArr[2], dateArr[1], dateArr[3]].join("/")
        if (date !== lastDate)
          dataCollection.labels.push(date)
        else dataCollection.labels.push(record.createdAt.split(" ")[4].slice(0, 5))
      }

    }
    if (options.transmitted) dataCollection.datasets[0]?.data.push(data.transmitted)
    if (options.received) dataCollection.datasets[1]?.data.push(data.received)
    if (options.loss) dataCollection.datasets[2]?.data.push(data.loss)
    if (options.stddev) dataCollection.datasets[3]?.data.push(data.stddev)
    if (options.min) dataCollection.datasets[4]?.data.push(data.min)
    if (options.avg) dataCollection.datasets[5]?.data.push(data.avg)
    if (options.max) dataCollection.datasets[6]?.data.push(data.max)
  }
  dataCollection.datasets = dataCollection.datasets.filter(Boolean)
  return dataCollection
}

const validPositionIdx = (state: State, newPositionIdx: State["viewConfig"]["positionIdx"]) => {
  const monitorRecordsList = Array.from(
    state.list.get(

      state.viewConfig.monitorId || ""
    )?.recordsList?.values()
    || [])
  if (newPositionIdx > monitorRecordsList.length - state.viewConfig.count)
    newPositionIdx = monitorRecordsList.length - state.viewConfig.count
  if (newPositionIdx < 0) newPositionIdx = 0
  const data = newPositionIdx
  return data
}

export const getters: NetLogGetters = {
  getMonitors: state =>
    Array.from(state.list.values()).map(e => ({
      id: e.id,
      title: e.title,
      address: e.address,
      interval: e.interval,
      launched: e.launched,
    })).reverse()
  ,
  getMonitorInfo: state => {
    const monitor = state.list.get(state.viewConfig.monitorId || "")
    return {
      id: monitor?.id,
      address: monitor?.address,
      title: monitor?.title,
      interval: monitor?.interval,
      launched: monitor?.launched,
      size: monitor?.recordsList.size
    }
  }
  ,
  getData: state => {

    return parseRecords(
      Array.from(
        state.list.get(

          state.viewConfig.monitorId || ""
        )?.recordsList?.values()
        || [])
        .slice(state.viewConfig.positionIdx, state.viewConfig.positionIdx + state.viewConfig.count))
  },
  getFullData: state => {

    return Array.from(state.list.values()).map(monitor => {
      const chartData = parseRecords(
        Array.from(
          monitor.recordsList.values()
          || [])
          .slice(-20), { avg: true })
      return {
        id: monitor.id,
        title: monitor.title,
        address: monitor.address,
        interval: monitor.interval,
        launched: monitor.launched,
        chartData
      }
    }).reverse()

  },

}

export const mutations: NetLogMutations = {
  setViewCount(state, count) {
    state.viewConfig.count = count
    state.viewConfig.positionIdx = validPositionIdx(state, state.viewConfig.positionIdx)

  },
  moveViewPosition(state, delta) {
    state.viewConfig.positionIdx = validPositionIdx(state, state.viewConfig.positionIdx + delta)
  },
  setMonitorId(state, monitorId) {
    state.viewConfig.monitorId = monitorId
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  saveLocalData(state, data) {
    state.list = data

  },
}
export const actions: NetLogActions = {
  loadData: (context) => {
    context.commit('setLoading', true)
    return fetch('/api/monitors')
      .then((data) => data.text())
      .then((sData) => {
        const oData: State["list"] = new Map<INetMonitor["id"], NetMonitorData>(
          JSON.parse(sData).
            map(([monitorId, monitorData]: [INetMonitor["id"], NetMonitorData]) =>
              [monitorId,
                {
                  ...monitorData,
                  recordsList: new Map<StateRecord["id"], StateRecord>(monitorData.recordsList)
                }
              ]
            )
        )
        context.commit('saveLocalData', oData)
        const _timer = setTimeout(() => {
          clearTimeout(_timer)
          context.commit('setLoading', false)
        }, 300);
      })
  },
  startAllMonitors: (context) => {

    return fetch('/api/monitors/start', { method: "POST" })
      .then(() => {
        return context.dispatch("loadData")
      })
      .then(() => {

      })

  },
  stopAllMonitors: (context) => {
    return fetch('/api/monitors/stop', { method: "POST" })
      .then(() => {
        return context.dispatch("loadData")
      })
      .then(() => {

      })

  },
  startMonitor: (context, monitorId) => {
    return fetch(`/api/monitors/start/${monitorId}`, { method: "POST" })
      .then(() => {
        return context.dispatch("loadData")
      })
      .then(() => {

      })

  },
  stopMonitor: (context, monitorId) => {
    return fetch(`/api/monitors/stop/${monitorId}`, { method: "POST" })
      .then(() => {
        return context.dispatch("loadData")
      })
      .then(() => {

      })

  },
  createMonitor: (context, config) => {
    return fetch(`/api/monitors/create`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'

      },
      body: JSON.stringify(config)
    })
      .then(() => {
        return context.dispatch("loadData")
      })
      .then(() => {

      })

  }
}
