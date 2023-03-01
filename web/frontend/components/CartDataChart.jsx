import React from 'react';

import {Card} from '@shopify/polaris';
import {BarChart, LineChart} from '@shopify/polaris-viz';

export function CartDataChart(props) {
  console.log('propps ', props.insightdata);
  const dataRow = [];
  props.insightdata.forEach( rowItem => {
    dataRow.push({key: rowItem[0], value: rowItem[1]});
  });
  
  const rows = [
    {
        name: 'Add To Carts',
        data: dataRow
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
                return `${y} carts`
            }
            }}
            data={rows}
          />
        </div>
      </Card>
  );
}
