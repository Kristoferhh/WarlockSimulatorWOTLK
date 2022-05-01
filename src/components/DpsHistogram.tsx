import { Chart, registerables } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/Store'

Chart.register(...registerables)

export default function DpsHistogram() {
  const histogramState = useSelector((state: RootState) => state.ui.Histogram)

  return histogramState.Data ? (
    <Bar
      id='dps-histogram'
      style={{ display: histogramState.Visible ? '' : 'none' }}
      data={{
        labels: Object.keys(histogramState.Data),
        datasets: [
          {
            label: 'DPS Histogram',
            data: Object.keys(histogramState.Data).map(
              key => histogramState.Data![key]
            ),
            borderWidth: 1,
            borderColor: '#9482C9',
          },
        ],
      }}
    />
  ) : (
    <div></div>
  )
}
