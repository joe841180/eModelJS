import { useCallback, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Stack, width } from "@mui/system";
import { Album } from "../others/album";

const disableList = ['pk', 'owner', 'create_date', 'update_date']; //開關鍵
const switchList = []; //開關鍵
const mutiLineList = ["simple_require", "detail_require"] //多行輸入框
const datepickerList = ["public_start", "public_end", "audtion_start", "audtion_end", "case_start", "case_end"] //日曆

// 設定下拉選單選項
const selector = {
  case_type: [
    {
      value: "0",
      label: "自管型",
    },
    {
      value: "1",
      label: "代管型",
    },
  ],
};


// 設定顯示文字/格線寬度
const profileSettings = {
  pk: {
    value: "pk",
    md: 2
  },
  owner: {
    value: "owner",
    md: 0
  },
  case_type: {
    value: "通告類型",
    md: 4
  },
  title: {
    value: "名稱",
    md: 4
  },
  phone: {
    value: "手機",
    md: 4
  },
  email: {
    value: "信箱",
    md: 6
  },
  contacter: {
    value: "聯繫人",
    md: 6
  },
  simple_require: {
    value: "簡述條件",
    md: 12
  },
  item_type: {
    value: "活動類型",
    md: 6
  },
  place: {
    value: "通告地點",
    md: 6
  },
  create_date: {
    value: "",
    md: 0
  },
  update_date: {
    value: "",
    md: 0
  },
  public_start: {
    value: "報名起始",
    md: 6
  },
  public_end: {
    value: "報名終止",
    md: 6
  },
  audtion_start: {
    value: "試鏡起始",
    md: 6
  },
  audtion_end: {
    value: "試鏡終止",
    md: 6
  },
  case_start: {
    value: "通告起始",
    md: 6
  },
  case_end: {
    value: "通告終止",
    md: 6
  },
  detail_require: {
    value: "需求內容",
    md: 12
  },
};

const tempAlbum = [
  {
    "id": "40a053fd-1645-4fba-ba00-04f69b1cf0f6",
    "case": "c95d1235-12a2-420b-941d-01b73f5a0cb3",
    "uploader": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
    "image": "/media/gAAAAABkO-FUlplK9dhq6unYW37dN37mBuNmYJayxUAObM4dugEmUFpbZvItnysq0qRTFxr-bqDqfkQuXa0ZuWV3AwcQfB-E0uJZM63itJ-SQzzv2IB5NIBXXl3xxLsuRMiTSsFNTltIW7UGWvHwhcxj-SDVLUo48YPc3KUheOzYJNZn8XjulYrvDh8PMI0GA1gMKRlfCOdKtjwHD_k6o9BPYivZENGwgBrqHDmTYXFR2uT3Wr9t-yM=",
    "upload_date": "2023-04-16T19:51:22.415111+08:00"
  }
]

export const CaseTabs = () => {
  // TABS
  const [currentTab, setCurrentTab] = useState('內容');
  const handleTabsChange = useCallback(
    (event, value) => {
      event.preventDefault();
      setCurrentTab(value);
    },
    []
  );

  // model詳細資料
  const [profileValues, setProfileValues] = useState({
    "pk": "c95d1235-12a2-420b-941d-01b73f5a0cb3",
    "owner": "1b783f4c-c07f-4fdd-9ba5-87080aa7cb7b",
    "case_type": "0",
    "title": "test2",
    "phone": "09767464",
    "email": "gdgdgf@gfdg.com",
    "contacter": "yyyy",
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
  });
  const handleProfileChange = useCallback((event) => {
    event.preventDefault();
    // console.log(event);
    if (dayjs(event).isValid()) {
      setProfileValues((prevState) => ({
        ...prevState,
        ['birth']: dayjs(event).format('YYYY-MM-DD'),
      }));
    }
    else if (switchList.includes(event.target.name)) {
      setProfileValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.checked,
      }));
    } else {
      setProfileValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  }, []);

  // const handleSubmit = useCallback((event) => {
  //   event.preventDefault();
  //   console.log("event");
  //   console.log(event);
  // }, []);
  const handleSubmit = () => {
    console.log("event");
  }

  // useEffect(() => {
  //   console.log(profileValues);
  // }, [profileValues]);

  return (
    <form autoComplete="on" noValidate >
      <Card>
        <Tabs
          onChange={handleTabsChange}
          sx={{ mb: 3, ml: 3 }}
          value={currentTab}
        >
          <Tab
            label="內容"
            value="內容"
          />
          <Tab
            label="相簿"
            value="相簿"
          />
        </Tabs>
        {/* profile/settings 都是用同一個useState */}
        {currentTab === '內容' && (
          <>
            {/* <CardHeader subheader="The information can be edited" title="Profile" /> */}
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={3}>
                  {Object.keys(profileValues).map((element, index) => {
                    // 下拉選單
                    if (Object.keys(selector).includes(element)) {
                      return (
                        <Grid key={index} xs={12} md={profileSettings[element].md}>
                          <TextField
                            fullWidth
                            label={profileSettings[element].value}
                            name={element}
                            onChange={handleProfileChange}
                            select
                            SelectProps={{ native: true }}
                            value={profileValues[element]}
                          >
                            {selector[element].map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                      );
                    }
                    else if (datepickerList.includes(element)) {
                      let date = dayjs(profileValues[element]).isValid() ? profileValues[element] : undefined;
                      return (
                        <Grid key={index} xs={12} md={profileSettings[element].md}>
                          <DatePicker
                            defaultValue={dayjs(new Date())}
                            label={profileSettings[element].value}
                            value={date}
                            onChange={handleProfileChange}
                            renderInput={
                              (params) =>
                                <TextField
                                  {...params}
                                />
                            }
                          />
                        </Grid>
                      )
                    }
                    // 輸入框
                    else if (!disableList.includes(element) && !switchList.includes(element)) {
                      let mutiLines = mutiLineList.includes(element) ? true : false

                      return (
                        <Grid key={index} xs={12} md={profileSettings[element].md}>
                          <TextField
                            fullWidth
                            // helperText="Please specify the first name"
                            label={profileSettings[element].value}
                            name={element}
                            onChange={handleProfileChange}
                            // required
                            value={profileValues[element]}
                            multiline={mutiLines}
                            rows={4}
                          ></TextField>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </Box>
            </CardContent>
          </>
        )}
        {currentTab === 'settings' && (
          <>
            {/* <CardHeader subheader="The information can be edited" title="Profile" /> */}
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ m: -1.5 }}>
                <Grid container spacing={3}>
                  {Object.keys(profileValues).map((element, index) => {
                    // 開關
                    if (switchList.includes(element)) {
                      return (
                        <Grid
                          container
                          key={index}
                          xs={12}
                          md={profileSettings[element].md}
                          px={4}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>{profileSettings[element].value}</Typography>
                          <Switch
                            checked={profileValues[element]}
                            onChange={handleProfileChange}
                            name={element}
                            color="primary"
                          />
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </Box>
            </CardContent>
          </>
        )}
        {currentTab === '相簿' && (
          <Album albumData={tempAlbum}></Album>
        )}

        {currentTab === 'consumption' && (
          <>
            <Divider />
            <CardActions sx={{ justifyContent: "flex-end" }}>
              <Button onClick={handleSubmit} variant="contained">Save</Button>
            </CardActions>
          </>
        )}

        <>
          <Divider />
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button onClick={handleSubmit} variant="contained">Save</Button>
          </CardActions>
        </>

      </Card>
    </form>
  );
};
