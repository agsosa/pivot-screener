import { types } from 'mobx-state-tree';

// TODO: Refactor actions

const ChartOptions = types
  .model({
    dailyCPR: types.boolean,
    weeklyCPR: types.boolean,
    monthlyCPR: types.boolean,
    dailyCam: types.boolean,
    weeklyCam: types.boolean,
    monthlyCam: types.boolean,
    futureMode: types.boolean, // developing pivots
  })
  .actions((self) => ({
    setFutureMode(value) {
      self.futureMode = value;
    },
    setDailyCPR(value) {
      self.dailyCPR = value;
    },
    setWeeklyCPR(value) {
      self.weeklyCPR = value;
    },
    setMonthlyCPR(value) {
      self.monthlyCPR = value;
    },
    setDailyCam(value) {
      self.dailyCam = value;
    },
    setWeeklyCam(value) {
      self.weeklyCam = value;
    },
    setMonthlyCam(value) {
      self.monthlyCam = value;
    },
    toggleAllDaily() {
      self.dailyCPR = !self.dailyCPR;
      self.dailyCam = !self.dailyCam;
    },
    toggleAllWeekly() {
      self.weeklyCPR = !self.weeklyCPR;
      self.weeklyCam = !self.weeklyCam;
    },
    toggleAllMonthly() {
      self.monthlyCPR = !self.monthlyCPR;
      self.monthlyCam = !self.monthlyCam;
    },
  }));

export default ChartOptions;
