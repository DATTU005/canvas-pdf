import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const maxWidth = 800;
const gridSize = 50;
const lineThickness = 1;

const Canvas = ({ onPdfUpload }) => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [containerRef, setContainerRef] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastMousePosition = useRef(null);

  const onResize = useCallback((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, {}, onResize);

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

  function onFileChange(event) {
    const { files } = event.target;

    if (files && files[0]) {
      setFile(files[0]);
      // Call the onPdfUpload callback with the uploaded file
      if (typeof onPdfUpload === "function") {
        onPdfUpload(files[0]);
      }
    }
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  const numVerticalLines = Math.ceil(
    (containerWidth || window.innerWidth) / gridSize
  );
  const numHorizontalLines = Math.ceil(window.innerHeight / gridSize);

  const verticalLines = Array.from(Array(numVerticalLines), (_, index) => ({
    points: [index * gridSize, 0, index * gridSize, window.innerHeight],
  }));

  const horizontalLines = Array.from(Array(numHorizontalLines), (_, index) => ({
    points: [
      0,
      index * gridSize,
      containerWidth || window.innerWidth,
      index * gridSize,
    ],
  }));

  return (
    <div className="PdfCanvas">
      <div className="PdfCanvas__container">
        <div className="PdfCanvas__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div>
        <div className="PdfCanvas__container__document" ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={
                  containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth
                }
              />
            ))}
          </Document>
          <Stage
            width={containerWidth || window.innerWidth}
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
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
