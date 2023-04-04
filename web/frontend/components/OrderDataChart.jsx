import React from 'react';

import {Card} from '@shopify/polaris';
import {BarChart, LineChart} from '@shopify/polaris-viz';

export function OrderDataChart(props) {
  console.log('propps ', props.insightdata);
  const dataRow = [];
  const dataRow2 = [];
  props.insightdata.forEach( rowItem => {
    dataRow.push({key: rowItem[0], value: rowItem[1]});
    dataRow2.push({key: rowItem[0], value: rowItem[2]});
  });
  
  const rows = [
    {
        name: 'Orders',
        data: dataRow
    },
    {
        name: 'Revenue',
        data: dataRow2
    }
  ];

  return (
      <Card sectioned>
        <div className='chart_container'>
          <LineChart
            xAxisOptions={{
            labelFormatter: (x) => {
                return `${x}`
            }
            }}
            yAxisOptions={{
            labelFormatter: (y) => {
                return `$${y}`
            }
            }}
            data={rows}
          />
        </div>
      </Card>
  );
}
