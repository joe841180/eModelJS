import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
  Paper,
  Divider,
  IconButton,
  InputBase
} from "@mui/material";
import {
  Directions as DirectionsIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  FilterAlt as FilterAltIcon,
} from '@mui/icons-material';


const data = [
  {
    id: "5e887b209c28ac3dd97f6db5",
    first_name: "Snow",
    last_name: "Jon",
    email: "jonsnow@gmail.com",
    phone: "(665)121-5454",
    upload_date: "03/12/2022",
  },
];

export const CustomersSearch = (props) => {
  const {
    setSearchResult,
    rowsPerPage,
  } = props
  const handleSearch = () => {
    setSearchResult((prevState) => data)
  }

  return (
    <Card sx={{ p: 2 }}>

      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search case"
        endAdornment={
          <IconButton onClick={handleSearch} type="button" aria-label="search">
            <SearchIcon />
          </IconButton>
        }
        sx={{ maxWidth: 500 }}
      />
      <IconButton type="button" aria-label="filter">
        <FilterAltIcon />
      </IconButton>
    </Card>
  )
};
