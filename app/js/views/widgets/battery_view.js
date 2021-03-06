const BATT_USED_COLOR = '#9b1889';
const BATT_REMAINING_COLOR = '#d67b19';

export class BatteryGraphView extends Backbone.View {

  constructor(options) {
    super(options);
    this.chart = this.initChart();
    this.listenTo(this.model, 'change', this.updateChart);
  }

  initChart() {
    return c3.generate({
      bindto: `#${this.id}`,
      data: {
        columns: [
          ['used', 100],
          ['remaining', 0],
        ],
        type: 'pie',
        colors: {
          used: BATT_USED_COLOR,
          remaining: BATT_REMAINING_COLOR,
        },
      },
    });
  }

  updateChart() {
    const remaining = this.model.attributes.value;
    this.chart.load({
      columns: [
        ['used', 100 - remaining],
        ['remaining', remaining],
      ],
    });
  }
}
