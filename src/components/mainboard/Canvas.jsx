import { Grid } from "@mui/material";
import React, { useEffect } from "react";

const Canvas = () => {
  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    // Define the grid spacing
    const gridSize = 10; // Grid size
    const lineThickness = 0.5; // Thickness of grid lines

    // Set line color
    context.strokeStyle = "rgba(0, 0, 0, 0.1)"; // Semi-transparent black for a lighter grid

    // Set line thickness
    context.lineWidth = lineThickness;

    // Draw vertical grid lines
    for (let x = gridSize; x < canvas.width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }

    // Draw horizontal grid lines
    for (let y = gridSize; y < canvas.height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <canvas
          id="canvas"
          style={{
            backgroundColor: "lightblue",
            height: "calc(100vh - 71px)",
            width: "100%",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Canvas;
