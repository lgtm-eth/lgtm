import AppBarLayout from "../components/AppBarLayout";
import { Container, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import Wordmark from "../Wordmark";

export default function About() {
  let theme = useTheme();
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", p: 4, mt: 10 }}>
        <Grid container spacing={0} columns={{ xs: 4, sm: 4, md: 24 }}>
          <Grid
            item
            md={4}
            sx={{ [theme.breakpoints.down("md")]: { display: "none" } }}
          >
            <svg height="200" width="200">
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="black"
                stroke-width="3"
                fill="blue"
              />
            </svg>
          </Grid>
          <Grid item md={16} sx={{ [theme.breakpoints.down("md")]: { pr: 4 } }}>
            <Wordmark height={300} />
            <Typography variant="h4" sx={{ pb: 5 }}>
              Building Tools for Trust
            </Typography>
            <Typography variant="body1" textAlign="left">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.{" "}
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.{" "}
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.{" "}
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.{" "}
              <br />
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Typography>
          </Grid>
          <Grid
            item
            md={4}
            sx={{ mt: 50, [theme.breakpoints.down("md")]: { display: "none" } }}
          >
            <svg height="200" width="200">
              <circle
                cx="100"
                cy="100"
                r="80"
                stroke="black"
                stroke-width="3"
                fill="green"
              />
            </svg>
          </Grid>
        </Grid>
      </Container>
    </AppBarLayout>
  );
}
