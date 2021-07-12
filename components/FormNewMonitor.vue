<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="title"
      :rules="titleRules"
      label="Title"
      required
    ></v-text-field>
    <v-text-field
      v-model="address"
      :rules="addressRules"
      label="adress/hosting"
      required
    ></v-text-field>
    <v-text-field
      v-model="interval"
      :rules="intervalRules"
      label="Interval (ms)"
      required
      type="number"
      :min="1200000"
    ></v-text-field>
    <v-text-field
      v-model="count"
      :rules="countRules"
      label="Packages per test"
      required
      type="number"
      :min="2"
      :max="10"
    ></v-text-field>

    <v-btn :disabled="!valid" rounded large @click="submit" color="primary">
      Create
    </v-btn>

    <v-btn rounded large @click="reset"> Clear Form </v-btn>
  </v-form>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'form-new-monitor',
  props: ['close'],
  data: () => ({
    valid: true,
    title: 'Localhost Monitoring',
    address: 'localhost',
    interval: 30 * 60 * 1000,
    count: 4,
    titleRules: [
      (v) => !!v || 'Title is required',
      (v) => (v && v.length >= 3) || 'Title must be longer than 3 characters',
    ],
    addressRules: [(v) => !!v || 'Address is required'],
    intervalRules: [
      (v) => !!v || 'Interval is required',
      (v) => v > 20 * 60 * 1000 || 'Min interval is 20 minutes(1200000ms)',
    ],
    countRules: [
      (v) => !!v || 'Packages count is required',
      (v) => v >= 2 || 'Min Packages count is 2',
      (v) => v <= 10 || 'Max Packages count is 10',
    ],
  }),

  methods: {
    ...mapActions({
      createMonitor: 'netlogs/createMonitor',
    }),
    submit() {
      this.validate()
      if (this.valid) {
        this.createMonitor({
          title: this.title,
          address: this.address,
          interval: this.interval,
          count: this.count,
        }).then(this.close)
      }
    },
    validate() {
      this.$refs.form?.validate()
    },
    reset() {
      this.$refs.form?.reset()
    },
    resetValidation() {
      this.$refs.form?.resetValidation()
    },
  },
})
</script>

<style lang="scss" scoped>
.a {
  color: red;
}
</style>
