import React from "react";
import { Routes, Route, } from "react-router-dom";
import { AppBar, Box, Button, Input, Toolbar, Typography, } from "@mui/material";
import {Camera} from "@mui/icons-material";

function LogoLGTM(props) {
  // TODO: proper logo image
  return <Camera {...props}/>
}

function WordmarkLGTM(props) {
  // TODO: proper wordmark image
  return <Typography variant="h6" color="inherit" noWrap {...props}>
    LGTM
  </Typography>;
}

function AppBarSearchInput() {
  // TODO: stylized app bar search input
  return <Input/>
}

function Layout({children}) {
  return <div style={{paddingTop: 72}}>
    <AppBar enableColorOnDark>
      <Toolbar>
        <Box sx={{display: "flex", alignItems: "center", flex: "auto"}}>
          <LogoLGTM sx={{mr: 2}}/>
          <WordmarkLGTM sx={{mr: 2}}/>
          <AppBarSearchInput/>
        </Box>
        <Button color="inherit" variant="outlined">Login</Button>
      </Toolbar>
    </AppBar>
    <main>
      {children}
    </main>
  </div>
}

// Pages

function Home() {
  return <Layout>TODO: home page</Layout>
}

function Project() {
  // TODO:
  // let {projectId} = useParams();
  // let project = useProject(projectId);
  return <Layout>
    TODO: project page
  </Layout>
}

function Reviewer() {
  // TODO:
  // let {reviewerId} = useParams();
  // let reviewer = useReviewer(reviewerId);
  return <Layout>TODO: reviewer page</Layout>
}

function NotFound404() {
  return <Layout>TODO: 404 page</Layout>
}

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        {/* TODO: */}
        {/*<Route path="/address/:address" element={<Address/>} />*/}
        <Route path="/project/:projectId" element={<Project/>} />
        <Route path="/reviewer/:reviewerId" element={<Reviewer/>} />
        <Route path="*" element={<NotFound404/>} />
      </Routes>
  );
}

export default App;