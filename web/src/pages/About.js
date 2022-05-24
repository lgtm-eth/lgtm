import AppBarLayout from "../components/AppBarLayout";
import { Container, Box, Button, Checkbox } from "@mui/material";
import {} from "@mui/icons-material/Star";
import React from "react";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function About() {
  return (
    <AppBarLayout>
      <Container sx={{ textAlign: "center", p: 4 }}>
        <Box sx={{ width: 200 }}>
          <Button variant="contained" color="primary">
            Hello World
          </Button>
          <Checkbox {...label} />
        </Box>
      </Container>
    </AppBarLayout>
  );
}
