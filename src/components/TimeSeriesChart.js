import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

//This is code minorly adapted from the code produced by github user dsandmark (Dennis Sandmark)
//which can be found here: https://github.com/recharts/recharts/issues/956
//all credit for the below code goes to him

const TimeSeriesChart = ({ chartData }) => (
  <ResponsiveContainer height = '95%' width = {500} >
    <ScatterChart>
      <XAxis
        dataKey = 'processedTime'
        domain = {['auto', 'auto']}
        name = 'Time'
        tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')}
        type = 'number'
      />
      <YAxis dataKey = 'value' name = 'Value' />

      <Scatter
        data = {chartData}
        line = {{ stroke: '#eee' }}
        lineJointType = 'monotoneX'
        lineType = 'joint'
        name = 'Values'
      />

    </ScatterChart>
  </ResponsiveContainer>
)

TimeSeriesChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      value: PropTypes.number
    })
  ).isRequired
}

export default TimeSeriesChart