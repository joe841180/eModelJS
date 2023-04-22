import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/case/case-table";
import { CustomersSearch } from "src/sections/case/case-search";
import { applyPagination } from "src/utils/apply-pagination";

const now = new Date();
// {
//   "count": 1,
//   "next": null,
//   "previous": null,
//   "results": [
//     {
//       "pk": "c95d1235-12a2-420b-941d-01b73f5a0cb3",
//       "owner": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
//       "case_type": "0",
//       "title": "test2",
//       "phone": "09767464",
//       "email": "gdgdgf@gfdg.com",
//       "contacter": "yyyy",
//       "simple_require": "simple_require",
//       "item_type": 1,
//       "place": 1,
//       "create_date": "2023-04-16T18:17:16.619897+08:00",
//       "update_date": "2023-04-16T18:17:16.619924+08:00",
//       "public_start": "2023/04/10 00:00",
//       "public_end": "2023/04/30 00:00",
//       "audtion_start": "2023/05/20 00:00",
//       "audtion_end": "2023/05/30 00:00",
//       "case_start": "2023/06/20 00:00",
//       "case_end": "2023/06/30 00:00",
//       "detail_require": "detail_require"
//     }
//   ]
// }

const data = [
  {
    "pk": "c95d1235-12a2-420b-941d-01b73f5a0cb3",
    "owner": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
    "case_type": "0",
    "title": "test2",
    "phone": "09767464",
    "email": "gdgdgf@gfdg.com",
    "contacter": "apple",
    "simple_require": "simple_require",
    "item_type": 1,
    "place": 1,
    "create_date": "2023-04-16T18:17:16.619897+08:00",
    "update_date": "2023-04-16T18:17:16.619924+08:00",
    "public_start": "2023/04/10 00:00",
    "public_end": "2023/04/30 00:00",
    "audtion_start": "2023/05/20 00:00",
    "audtion_end": "2023/05/30 00:00",
    "case_start": "2023/06/20 00:00",
    "case_end": "2023/06/30 00:00",
    "detail_require": "detail_require"
  },
  {
    "pk": "c95d1235-12a2-420b-941d-01b73f5a0cb4",
    "owner": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
    "case_type": "0",
    "title": "test2",
    "phone": "09767464",
    "email": "gdgdgf@gfdg.com",
    "contacter": "apple",
    "simple_require": "simple_require",
    "item_type": 1,
    "place": 1,
    "create_date": "2023-04-16T18:17:16.619897+08:00",
    "update_date": "2023-04-16T18:17:16.619924+08:00",
    "public_start": "2023/04/10 00:00",
    "public_end": "2023/04/30 00:00",
    "audtion_start": "2023/05/20 00:00",
    "audtion_end": "2023/05/30 00:00",
    "case_start": "2023/06/20 00:00",
    "case_end": "2023/06/30 00:00",
    "detail_require": "detail_require"
  },
  {
    "pk": "c95d1235-12a2-420b-941d-01b73f5a0cb5",
    "owner": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
    "case_type": "0",
    "title": "test2",
    "phone": "09767464",
    "email": "gdgdgf@gfdg.com",
    "contacter": "apple",
    "simple_require": "simple_require",
    "item_type": 1,
    "place": 1,
    "create_date": "2023-04-16T18:17:16.619897+08:00",
    "update_date": "2023-04-16T18:17:16.619924+08:00",
    "public_start": "2023/04/10 00:00",
    "public_end": "2023/04/30 00:00",
    "audtion_start": "2023/05/20 00:00",
    "audtion_end": "2023/05/30 00:00",
    "case_start": "2023/06/20 00:00",
    "case_end": "2023/06/30 00:00",
    "detail_require": "detail_require"
  },
];

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("useCustomers");
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.pk);
  }, [customers]);
};

const Page = () => {
  const [searchResult, setSearchResult] = useState(data);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(searchResult, page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);


  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Case</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Case</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            {/* 搜尋BAR */}
            <CustomersSearch useCustomers={useCustomers} rowsPerPage={rowsPerPage} setSearchResult={setSearchResult} />
            {/* 搜尋結果 */}
            {searchResult.length > 0 && (
              <CustomersTable
                count={data.length}
                items={customers}
                onDeselectAll={customersSelection.handleDeselectAll}
                onDeselectOne={customersSelection.handleDeselectOne}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectAll={customersSelection.handleSelectAll}
                onSelectOne={customersSelection.handleSelectOne}
                page={page}
                rowsPerPage={rowsPerPage}
                selected={customersSelection.selected}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
