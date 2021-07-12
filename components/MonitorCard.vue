<template>
  <v-card>
    <v-row justify="space-between">
      <v-card-title>
        {{ monitor.title }}
      </v-card-title>
      <v-card-title>
        <v-btn
          v-if="monitor.launched"
          :loading="loading"
          :disabled="loading"
          rounded
          @click="() => stop(monitor.id)"
        >
          <v-icon dark color="success">mdi-power-standby</v-icon>
        </v-btn>
        <v-btn
          v-else
          :loading="loading"
          :disabled="loading"
          rounded
          @click="() => start(monitor.id)"
        >
          <v-icon dark color="error">mdi-power-standby</v-icon>
        </v-btn>
      </v-card-title>
    </v-row>

    <v-divider></v-divider>
    <line-chart
      :chart-data="monitor.chartData"
      :options="{ responsive: true, maintainAspectRatio: false }"
    />
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn rounded block @click="() => goToMonitor(monitor.id)">More</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'
import LineChart from '~/components/LineChart.vue'

export default Vue.extend({
  name: 'monitor-card',
  components: { LineChart },
  props: {
    monitor: { type: Object, default: () => {} },
  },
  data() {
    return {}
  },
  computed: {
    loading() {
      return this.$store.state.netlogs.loading
    },
  },
  methods: {
    goToMonitor(monitorId) {
      this.setMonitorId(monitorId)
      this.$router.push('/monitor')
    },
    ...mapMutations({
      setMonitorId: 'netlogs/setMonitorId',
    }),
    ...mapActions({
      stop: 'netlogs/stopMonitor',
      start: 'netlogs/startMonitor',
    }),
  },
})
</script>

<style lang="scss" scoped>
.a {
  color: red;
}
</style>
