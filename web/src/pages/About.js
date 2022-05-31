import AppBarLayout from "../components/AppBarLayout";
import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import Wordmark from "../Wordmark";

export default function About() {
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", p: 4, mt: 10 }}>
        <Grid container spacing={0} columns={{ xs: 4, sm: 4, md: 24 }}>
          <Grid item sm={-1000} md={4} sx={{ m: 0, p: 0 }}>
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
          <Grid item xs={4} md={16}>
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
          <Grid item sm={1000} md={4} sx={{ mt: 50 }}>
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
