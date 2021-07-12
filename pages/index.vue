<template>
  <v-container>
    <v-col>
      <v-row>
        <!--  -->
        <v-col cols="auto"> </v-col>
        <!--  -->
      </v-row>
      <v-row justify="space-between">
        <v-col cols="12" md="6" lg="4">
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
        <v-col cols="12" md="6" lg="4">
          <v-dialog max-width="600" v-model="formCreation">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :loading="loading"
                :disabled="loading"
                rounded
                x-large
                block
                v-bind="attrs"
                v-on="on"
              >
                <!-- @click="
              () =>
                createMonitor({ address: 'nahui.me', title: 'my test title 2' })
            " -->
                <v-row justify="space-between">
                  create new monitor
                  <v-icon x-large right dark>
                    mdi-text-box-plus-outline
                  </v-icon>
                </v-row>
              </v-btn>
            </template>
            <v-card class="pa-3">
              <form-new-monitor
                v-if="formCreation"
                :close="() => (formCreation = false)"
              />
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col
          v-for="monitor in monitors"
          :key="monitor.id"
          cols="12"
          md="6"
          lg="4"
        >
          <monitor-card :monitor="monitor" />
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
// import LineChart from '~/components/LineChart.vue'
import MonitorCard from '~/components/MonitorCard.vue'

export default Vue.extend({
  components: {
    MonitorCard,
  },
  data() {
    return {
      formCreation: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.netlogs.loading
    },
    monitors() {
      return this.$store.getters['netlogs/getFullData']
    },
  },
  watch: {},
  mounted() {
    this.fullLoad()
  },
  methods: {
    goToMonitor(monitorId) {
      this.setMonitorId(monitorId)
      this.$router.push('/monitor')
    },
    ...mapActions({
      fullLoad: 'netlogs/loadData',
      createMonitor: 'netlogs/createMonitor',
    }),
    ...mapMutations({
      setMonitorId: 'netlogs/setMonitorId',
    }),
  },
})
</script>
