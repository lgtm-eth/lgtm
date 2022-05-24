import AppBarLayout from "../components/AppBarLayout";
import { Container, Box, Button, Checkbox } from "@mui/material";
import React from "react";
//this comment should not get removed
export default function About() {
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", p: 4 }}>
        <Box sx={{ width: 200 }}>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
          <Checkbox />
        </Box>
      </Container>
    </AppBarLayout>
  );
}
