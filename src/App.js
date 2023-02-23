import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Dashboard from "./scenes/global/dashboard";
import Sidebar from "./scenes/global/Sidebar";
// import Team from "./scenes/global/team";
// import Invoices from "./scenes/global/invoices";
// import Contents from "./scenes/global/contents";
// import Bar from "./scenes/global/bar";
// import Form from "./scenes/global/orm";
// import Line from "./scenes/global/line";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/team" element={<Team />} /> */}
              {/* <Route path="/invoices" element={<Invoices />} /> */}
              {/* <Route path="/contents" element={<Contents />} /> */}
              {/* <Route path="/bar" element={<Bar />} /> */}
              {/* <Route path="/form" element={<Form />} /> */}
              {/* <Route path="/line" element={<Line />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
