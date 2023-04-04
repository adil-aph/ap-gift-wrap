import {React,useState,useMemo} from 'react';
import {Card, DataTable, Link} from '@shopify/polaris';
import AppPaginationOutput from './AppPaginationOutput';

export function CartDataTable(props) {
  console.log('propps ', props.insightdata);
  let PageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.insightdata.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const tempRow = currentTableData.map( elem => {
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
          footerContent={`Showing ${currentTableData.length} of ${props.insightdata.length} results`}
        />
        <AppPaginationOutput
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={props.insightdata.length}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        /> 
      </Card>
  );
}
