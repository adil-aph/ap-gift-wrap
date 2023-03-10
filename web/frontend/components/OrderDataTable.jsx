import React from 'react';
import {Card, DataTable} from '@shopify/polaris';

export function OrderDataTable(props) {
  console.log('propps odrer ', props.insightdata);
  const rows = props.insightdata;

  return (
      <Card sectioned>
          <h3 className="Polaris-Subheading">Clicks over time</h3>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
            'numeric',
          ]}
          headings={[
            'Date',
            'Total Orders',
            'Orders Amount'
          ]}
          rows={rows}
          footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
      </Card>
  );
}
