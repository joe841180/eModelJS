import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import { subDays, subHours } from "date-fns";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";

const now = new Date();

const data = [
  {
    id: "5e887b209c28ac3dd97f6db5",
    first_name: "Snow",
    last_name: "Jon",
    email: "jonsnow@gmail.com",
    phone: "(665)121-5454",
    upload_date: "03/12/2022",
  },
  {
    id: "5e887b209c28ac3dd97f6db1",
    first_name: "Snow",
    last_name: "Jon",
    email: "jonsnow@gmail.com",
    phone: "(665)121-5454",
    upload_date: "03/12/2022",
  },
  {
    id: "5e887b209c28ac3dd97f6db9",
    first_name: "Snow",
    last_name: "Jon",
    email: "jonsnow@gmail.com",
    phone: "(665)121-5454",
    upload_date: "03/12/2022",
  },
  // {
  //   id: '5e887b209c28ac3dd97f6db5',
  //   address: {
  //     city: 'Atlanta',
  //     country: 'USA',
  //     state: 'Georgia',
  //     street: '1865  Pleasant Hill Road'
  //   },
  //   avatar: '/assets/avatars/avatar-fran-perez.png',
  //   createdAt: subDays(subHours(now, 1), 2).getTime(),
  //   email: 'fran.perez@devias.io',
  //   name: 'Fran Perez',
  //   phone: '712-351-5711'
  // },
];

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    console.log("useCustomers");
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
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
        <title>Model</title>
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
                <Typography variant="h4">Model</Typography>
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
            <CustomersSearch useCustomers={useCustomers} rowsPerPage={rowsPerPage} setSearchResult={setSearchResult} />
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
