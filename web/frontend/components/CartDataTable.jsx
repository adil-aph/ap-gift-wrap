import React from 'react';
import {Card, DataTable} from '@shopify/polaris';

export function CartDataTable(props) {
  console.log('propps ', props.insightdata);
  const rows = props.insightdata;

  return (
      <Card sectioned>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
          ]}
          headings={[
            'Date',
            'Add To Carts',
          ]}
          rows={rows}
          footerContent={`Showing ${rows.length} of ${rows.length} results`}
        />
      </Card>
  );
}
