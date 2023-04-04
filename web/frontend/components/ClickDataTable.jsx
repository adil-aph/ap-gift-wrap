import {React,useState,useMemo} from 'react';
import {Card, DataTable} from '@shopify/polaris';
import AppPaginationOutput from './AppPaginationOutput';

export function ClickDataTable(props) {
  console.log('propps ', props.insightdata);
  let PageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return props.insightdata.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const rows = currentTableData;

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
