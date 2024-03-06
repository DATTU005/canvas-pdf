import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import PdfUpload from "./PdfUpload";
import { Document, Page } from "react-pdf";

export default function Maiboard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pdfFile, setPdfFile] = React.useState(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef(null);

  const gridSize = 50;
  const lineThickness = 1;
  const isMenuOpen = Boolean(anchorEl);
  // Calculate the number of grid lines needed
  const numVerticalLines = Math.ceil(window.innerWidth / gridSize);
  const numHorizontalLines = Math.ceil(window.innerHeight / gridSize);

  // Generate array of vertical lines
  const verticalLines = Array.from(Array(numVerticalLines), (_, index) => ({
    points: [index * gridSize, 0, index * gridSize, window.innerHeight],
  }));

  // Generate array of horizontal lines
  const horizontalLines = Array.from(Array(numHorizontalLines), (_, index) => ({
    points: [0, index * gridSize, window.innerWidth, index * gridSize],
  }));

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const scaleFactor = e.evt.deltaY > 0 ? 1.05 : 0.95;

    setScale((prevScale) => {
      const newScale = prevScale * scaleFactor;
      return newScale;
    });

    setPosition((prevPosition) => {
      const deltaX =
        pointerPos.x -
        (pointerPos.x - prevPosition.x) * scaleFactor -
        prevPosition.x;
      const deltaY =
        pointerPos.y -
        (pointerPos.y - prevPosition.y) * scaleFactor -
        prevPosition.y;

      const newPosition = {
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      };
      return newPosition;
    });
  };

  const handleMouseDown = (e) => {
    lastMousePosition.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handlePdfUpload = (file) => {
    setPdfFile(file);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, position: "fixed" }}>
      <AppBar position="static">
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={2} sm={2}>
              <Typography variant="h6" noWrap>
                <PdfUpload onPdfUpload={handlePdfUpload} />
              </Typography>
            </Grid>
            <Grid item xs={10} sm={10}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: { xs: "none", md: "flex" } }}>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          {verticalLines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth={lineThickness}
            />
          ))}
          {horizontalLines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth={lineThickness}
            />
          ))}
          {pdfFile && (
            <Document file={pdfFile}>
              <Page
                pageNumber={1}
                width={window.innerWidth}
                height={window.innerHeight}
              />
            </Document>
          )}
        </Layer>
      </Stage>
      {renderMenu}
    </Box>
  );
}
