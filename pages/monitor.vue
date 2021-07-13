<template>
  <!-- <div class="small"> -->
  <!-- <line-chart :chart-data="datacollectionfull"></line-chart> -->
  <v-container>
    <v-row>
      <v-col>
        <v-row justify="space-between">
          <v-col cols="12" sm="6" lg="4">
            <v-select
              :items="monitors"
              :value="viewConfig.monitorId"
              label="Selected Monitor"
              item-text="title"
              item-value="id"
              filled
              dense
              rounded
              @change="setMonitorId"
            />
          </v-col>
          <v-col cols="12" sm="6" lg="4">
            <v-btn
              :loading="loading"
              :disabled="loading"
              rounded
              x-large
              block
              @click="fullLoad"
            >
              <v-row justify="space-between">
                refresh data
                <v-icon x-large right dark> mdi-refresh </v-icon>
              </v-row>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" lg="4">
            <v-btn
              v-if="monitorInfo.launched"
              :loading="loading"
              :disabled="loading"
              block
              rounded
              x-large
              @click="() => stop(monitorInfo.id)"
            >
              <v-row justify="space-between">
                stop monitor
                <v-icon x-large left dark color="success"
                  >mdi-power-standby</v-icon
                >
              </v-row>
            </v-btn>
            <v-btn
              v-else
              :loading="loading"
              :disabled="loading"
              rounded
              x-large
              block
              @click="() => start(monitorInfo.id)"
            >
              <v-row justify="space-between">
                start monitor
                <v-icon x-large left dark color="error"
                  >mdi-power-standby</v-icon
                >
              </v-row>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-switch
              v-model="view.graph1"
              label="Chart1: packages stats"
              hide-details
            />
          </v-col>
          <v-col cols="6">
            <v-switch
              v-model="view.graph2"
              label="Chart2: speed stats"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            v-if="view.graph1"
            cols="12"
            :sm="view.graph1 && view.graph2 ? 6 : 12"
            class="chart-container"
          >
            <line-chart
              :chart-data="datacollection1"
              :options="{ responsive: true, maintainAspectRatio: false }"
            />
          </v-col>
          <v-col
            v-if="view.graph2"
            cols="12"
            :sm="view.graph1 && view.graph2 ? 6 : 12"
            class="chart-container"
          >
            <line-chart
              :chart-data="datacollection2"
              :options="{ responsive: true, maintainAspectRatio: false }"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-slider
            hint="Im a hint"
            :thumb-label="true"
            min="0"
            :max="
              monitorInfo.size - viewConfig.count < 0
                ? 0
                : monitorInfo.size - viewConfig.count
            "
            :value="viewConfig.positionIdx"
            @change="
              (newVal) => moveViewPosition(newVal - viewConfig.positionIdx)
            "
          ></v-slider>
        </v-row>
        <v-row justify="center">
          <v-col cols="4">
            <v-btn rounded x-large block @click="() => moveViewPosition(-1)">
              <v-row justify="space-between">
                <v-icon x-large left dark>mdi-chevron-left</v-icon>
                to left
              </v-row>
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-select
              :value="viewConfig.count"
              :items="[5, 10, 20, 30, 50, 100]"
              label="View points"
              filled
              dense
              rounded
              @change="setViewCount"
            />
            <v-row justify="center">
              view first {{ viewConfig.count }} elems, start from
              {{ viewConfig.positionIdx }}
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-btn rounded x-large block @click="() => moveViewPosition(1)">
              <v-row justify="space-between">
                to right
                <v-icon x-large right dark>mdi-chevron-right</v-icon>
              </v-row>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-switch
              v-model="backgroundColor"
              label="Show background"
              hide-details
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <!-- </div> -->
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
import LineChart from '~/components/LineChart.vue'

export default Vue.extend({
  components: {
    LineChart,
  },
  data() {
    return {
      view: { graph1: true, graph2: true },
      backgroundColor: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.netlogs.loading
    },
    viewConfig() {
      return this.$store.state.netlogs.viewConfig
    },
    monitors() {
      return this.$store.getters['netlogs/getMonitors']
    },
    monitorInfo() {
      return this.$store.getters['netlogs/getMonitorInfo']
    },
    datacollectionfull() {
      const data = this.$store.getters['netlogs/getData']
      if (!this.backgroundColor)
        return {
          ...data,
          datasets: data.datasets.map((ds) => ({
            ...ds,
            backgroundColor: null,
          })),
        }
      return data
    },
    datacollection1() {
      return {
        labels: this.datacollectionfull.labels,
        datasets: this.datacollectionfull.datasets.slice(0, 3),
      }
    },
    datacollection2() {
      return {
        labels: this.datacollectionfull.labels,
        datasets: this.datacollectionfull.datasets.slice(3),
      }
    },
  },
  watch: {
    view() {
      if (typeof window !== 'undefined') window.resize()
    },
  },
  mounted() {
    this.fullLoad()
  },

  methods: {
    ...mapActions({
      fullLoad: 'netlogs/loadData',
      stop: 'netlogs/stopMonitor',
      start: 'netlogs/startMonitor',
    }),
    ...mapMutations({
      setViewCount: 'netlogs/setViewCount',
      setMonitorId: 'netlogs/setMonitorId',
      moveViewPosition: 'netlogs/moveViewPosition',
    }),
  },
})
</script>

<style lang="scss" scoped>
.chart-container {
  flex-grow: 1;
  min-height: 0;
  > div {
    position: relative;
    height: 100%;
  }
}
</style>
