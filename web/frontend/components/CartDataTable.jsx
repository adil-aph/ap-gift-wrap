import React from 'react';
import {Card, DataTable, Link} from '@shopify/polaris';

export function CartDataTable(props) {
  console.log('propps ', props.insightdata);

  const tempRow = props.insightdata.map( elem => {
    let tmp = <Link
    removeUnderline
    url= {elem[2]}
    key={elem[3]}
  >
   {elem[3]}
  </Link>;
    let elemArr = [];
    elemArr[0] = elem[0]
    elemArr[1] = elem[1]
    elemArr[2] = tmp;
    return elemArr;
  });
  return (
      <Card sectioned>
        <h3 className="Polaris-Subheading">Add to Cart over time</h3>
        <DataTable
          columnContentTypes={[
            'text',
            'numeric',
          ]}
          headings={[
            'Date',
            'Add To Carts',
            'Products',
          ]}
          rows={tempRow}
          footerContent={`Showing ${tempRow.length} of ${tempRow.length} results`}
        />
      </Card>
  );
}
