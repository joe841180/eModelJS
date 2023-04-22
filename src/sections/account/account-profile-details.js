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

const switchList = [
  "is_public",
  "case_available",
  "phone_public",
  "case_message",
  "system_message",
  "allow_manager_edit",
];
const mutiLineList = ["feature_description", "detailed_experience", "self_introduction"]

// 設定下拉選單選項
const selector = {
  gender: [
    {
      value: "0",
      label: "男",
    },
    {
      value: "1",
      label: "女",
    },
  ],
  blood_type: [
    {
      value: "0",
      label: "O",
    },
    {
      value: "1",
      label: "A",
    },
    {
      value: "2",
      label: "B",
    },
    {
      value: "3",
      label: "AB",
    },
  ],
  constellation: [
    {
      value: "0",
      label: "牡羊座",
    },
    {
      value: "1",
      label: "巨蟹座",
    },
    {
      value: "2",
      label: "天秤座",
    },
    {
      value: "3",
      label: "魔羯座",
    },
    {
      value: "4",
      label: "金牛座",
    },
    {
      value: "5",
      label: "獅子座",
    },
    {
      value: "6",
      label: "天蠍座",
    },
    {
      value: "7",
      label: "水瓶座",
    },
    {
      value: "8",
      label: "雙子座",
    },
    {
      value: "9",
      label: "處女座",
    },
    {
      value: "10",
      label: "射手座",
    },
    {
      value: "11",
      label: "雙魚座",
    },
  ],
  cloth_size: [
    {
      value: 0,
      label: "XXL",
    },
    {
      value: 1,
      label: "XL",
    },
    {
      value: 2,
      label: "L",
    },
    {
      value: 3,
      label: "M",
    },
    {
      value: 4,
      label: "S",
    },
    {
      value: 5,
      label: "XS",
    },
    {
      value: 6,
      label: "XXS",
    },
  ],
  shoe_unit_type: [
    {
      value: 0,
      label: "美國碼",
    },
    {
      value: 1,
      label: "歐洲碼",
    },
    {
      value: 2,
      label: "日本碼",
    },
    {
      value: 3,
      label: "台灣碼",
    },
  ],
  pupil_color: [
    {
      value: 0,
      label: "黑",
    },
    {
      value: 1,
      label: "棕",
    },
    {
      value: 2,
      label: "藍",
    },
    {
      value: 3,
      label: "綠",
    },
    {
      value: 4,
      label: "其他",
    },
  ],
  hair_length: [
    {
      value: 0,
      label: "光頭",
    },
    {
      value: 1,
      label: "短髮",
    },
    {
      value: 2,
      label: "及肩",
    },
    {
      value: 3,
      label: "中長",
    },
    {
      value: 4,
      label: "長髮",
    },
  ],
  skin_color: [
    {
      value: 0,
      label: "健康黑",
    },
    {
      value: 1,
      label: "普通偏黑",
    },
    {
      value: 2,
      label: "普通偏白",
    },
    {
      value: 3,
      label: "白皙",
    },
    {
      value: 4,
      label: "其他",
    },
  ],
  professional: [
    {
      value: 0,
      label: "無訓練",
    },
    {
      value: 1,
      label: "兼職",
    },
    {
      value: 2,
      label: "專業",
    },
  ],
  experience: [
    {
      value: 0,
      label: "無經驗",
    },
    {
      value: 1,
      label: "兼職",
    },
    {
      value: 2,
      label: "專業",
    },
  ],
  cup: [
    {
      value: "0",
      label: "A",
    },
    {
      value: "1",
      label: "B",
    },
    {
      value: "2",
      label: "C",
    },
    {
      value: "3",
      label: "D",
    },
    {
      value: "4",
      label: "E",
    },
    {
      value: "5",
      label: "F",
    },
    {
      value: "6",
      label: "G",
    },
    {
      value: "7",
      label: "H",
    },
    {
      value: "8",
      label: "I",
    },
    {
      value: "9",
      label: "J",
    },
    {
      value: "10",
      label: "K",
    },
    {
      value: "11",
      label: "L",
    },
    {
      value: "12",
      label: "M",
    },
    {
      value: "13",
      label: "N",
    },
    {
      value: "14",
      label: "O",
    },
    {
      value: "15",
      label: "P",
    },
    {
      value: "16",
      label: "Q",
    },
    {
      value: "17",
      label: "R",
    },
    {
      value: "18",
      label: "S",
    },
    {
      value: "19",
      label: "T",
    },
    {
      value: "20",
      label: "U",
    },
    {
      value: "21",
      label: "V",
    },
    {
      value: "22",
      label: "W",
    },
    {
      value: "23",
      label: "X",
    },
    {
      value: "24",
      label: "Y",
    },
    {
      value: "25",
      label: "Z",
    },
  ],
};


// 設定顯示文字/格線寬度
const profileSettings = {
  first_name: {
    value: "First Name",
    md: 4
  },
  last_name: {
    value: "Last Name",
    md: 4
  },
  nickname: {
    value: "用戶暱稱",
    md: 4
  },
  phone: {
    value: "phone",
    md: 6
  },
  email: {
    value: "信箱",
    md: 6
  },
  portrait: {
    value: "頭像照片",
    md: 6
  },
  is_public: {
    value: "公開個人資料",
    md: 6
  },
  case_available: {
    value: "接案狀態",
    md: 6
  },
  phone_public: {
    value: "公開手機",
    md: 6
  },
  spare_email: {
    value: "備用信箱",
    md: 6
  },
  gender: {
    value: "性別",
    md: 6
  },
  blood_type: {
    value: "血型",
    md: 6
  },
  birth: {
    value: "生日",
    md: 6
  },
  id_code: {
    value: "身分證號",
    md: 6
  },
  country: {
    value: "國家",
    md: 4
  },
  city: {
    value: "城市",
    md: 4
  },
  district: {
    value: "地區",
    md: 4
  },
  address: {
    value: "詳細地址",
    md: 12
  },
  height: {
    value: "身高",
    md: 6
  },
  weight: {
    value: "體重",
    md: 6
  },
  constellation: {
    value: "星座",
    md: 6
  },
  chest: {
    value: "上圍",
    md: 4
  },
  waist: {
    value: "中圍",
    md: 4
  },
  hips: {
    value: "下圍",
    md: 4
  },
  cup: {
    value: "CUP",
    md: 4
  },
  cloth_size: {
    value: "衣服尺寸",
    md: 4
  },
  shoe_unit_type: {
    value: "鞋號單位",
    md: 4
  },
  shoe_size: {
    value: "鞋號尺寸",
    md: 4
  },
  pupil_color: {
    value: "瞳孔顏色",
    md: 4
  },
  hair_length: {
    value: "髮長",
    md: 4
  },
  skin_color: {
    value: "膚色",
    md: 4
  },
  professional: {
    value: "專業性",
    md: 4
  },
  experience: {
    value: "演藝經驗",
    md: 4
  },
  feature_description: {
    value: "特徵說明",
    md: 12
  },
  detailed_experience: {
    value: "詳細演藝經驗",
    md: 12
  },
  self_introduction: {
    value: "自我介紹",
    md: 12
  },
  case_message: {
    value: "通告建議通知信",
    md: 6
  },
  system_message: {
    value: "系統通知信",
    md: 6
  },
  allow_manager_edit: {
    value: "經紀人編輯許可",
    md: 6
  },
};

const tempAlbum = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    author: '@bkristastucchio',
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
    author: '@rollelflex_graphy726',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
    author: '@helloimnik',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    author: '@nolanissac',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    author: '@hjrc33',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
    featured: true,
  },
];

export const AccountProfileDetails = () => {
  // TABS
  const [currentTab, setCurrentTab] = useState('profile');
  const handleTabsChange = useCallback(
    (event, value) => {
      event.preventDefault();
      setCurrentTab(value);
    },
    []
  );

  // model詳細資料
  const [profileValues, setProfileValues] = useState({
    is_public: true,
    case_available: true,
    first_name: "string",
    last_name: "string",
    nickname: "string",
    phone_public: true,
    email: "string",
    spare_email: "string",
    phone: "string",
    portrait: 0,
    gender: "string",
    blood_type: "string",
    constellation: "string",
    height: 0,
    weight: 0,
    birth: "string",
    id_code: "string",
    country: 0,
    city: 0,
    district: 0,
    address: "string",
    chest: 0,
    waist: 0,
    hips: 0,
    cup: "string",
    cloth_size: 0,
    shoe_unit_type: 0,
    shoe_size: 0,
    pupil_color: 0,
    hair_length: 0,
    skin_color: 0,
    professional: 0,
    experience: 0,
    feature_description: "string",
    detailed_experience: "string",
    self_introduction: "string",
    case_message: true,
    system_message: true,
    allow_manager_edit: true,
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
            label="Profile"
            value="profile"
          />
          <Tab
            label="Settings"
            value="settings"
          />
          <Tab
            label="Albums"
            value="albums"
          />
          <Tab
            label="Consumption"
            value="consumption"
          />
        </Tabs>
        {/* profile/settings 都是用同一個useState */}
        {currentTab === 'profile' && (
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
                    else if (element === 'birth') {
                      let birthDate = dayjs(profileValues[element]).isValid() ? profileValues[element] : undefined;
                      return (
                        <Grid key={index} xs={12} md={profileSettings[element].md}>
                          <DatePicker
                            defaultValue={dayjs(new Date())}
                            label={profileSettings[element].value}
                            value={birthDate}
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
                    else if (element !== "portrait" && !switchList.includes(element)) {
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
        {currentTab === 'albums' && (
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
