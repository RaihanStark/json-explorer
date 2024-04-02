import DataTable from "./components/DataTable";
import HeaderActions from "./components/HeaderActions";
import { getHeaders, getItems, getTotalDocument } from "./actions/database";

export default async function Home({ searchParams }) {
  let { page, limit } = searchParams;

  if (!page) {
    page = 1;
  }

  if (!limit) {
    limit = 5;
  }

  if (limit > 100) {
    limit = 100;
  }

  let search = searchParams.search || null;
  let searchBy = searchParams.searchBy || null;
  let condition = searchParams.condition || null;

  // fetching
  const items_response = await getItems(
    page,
    parseInt(limit),
    searchBy,
    search,
    condition,
  );
  const items = items_response ? items_response.data : [];
  const totalItems = items_response ? items_response.total : 0;

  // generate 1-10 or 11 - 21 from total items and page number
  const generatePageMeta = (page = 1, totalItems, limit = 5) => {
    const start = (page - 1) * limit + 1;
    const end = page * limit;
    return `${start} - ${end > totalItems ? totalItems : end}`;
  };

  // processing data
  const headers_response = await getHeaders();
  const headersWithType = headers_response ? headers_response.headers : {};
  const headers = headers_response
    ? ["_id", ...Object.keys(headers_response.headers)]
    : [];

  return (
    <div className="mx-auto p-10">
      <HeaderActions headers={headers} headersWithType={headersWithType} />
      {items.length > 0 && headers.length > 0 ? (
        <DataTable
          headers={headers}
          items={items}
          totalItems={totalItems}
          totalPages={Math.ceil(totalItems / limit)}
          currentPage={page}
          currentLimit={limit}
          pageMeta={generatePageMeta(page, totalItems, limit)}
        />
      ) : (
        <div className="text-center">No Data Displayed</div>
      )}
    </div>
  );
}
