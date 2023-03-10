import React from 'react';
import {Card, DataTable} from '@shopify/polaris';

export function ClickDataTable(props) {
  console.log('propps ', props.insightdata);
  const rows = props.insightdata;

  return (
      <Card sectioned>
          <h3 className="Polaris-Subheading">Clicks over time</h3>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
          ]}
          headings={[
            'Date',
            'Clicks',
          ]}
          rows={rows}
          footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
      </Card>
  );
}
