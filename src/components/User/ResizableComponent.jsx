// import React, { useState, useRef, useCallback, useEffect } from "react";

// export const ResizableComponent = ({
//   children,
//   defaultWidth = 275,
//   minWidth = 200,
//   maxWidth = 1200,
//   onClose,
// }) => {
//   const [width, setWidth] = useState(defaultWidth);
//   const [isResizing, setIsResizing] = useState(false);
//   const containerRef = useRef(null);
//   const startXRef = useRef(0);
//   const startWidthRef = useRef(0);

//   const handleMouseDown = useCallback(
//     (e) => {
//       e.preventDefault();
//       setIsResizing(true);
//       startXRef.current = e.clientX;
//       startWidthRef.current = width;

//       document.body.style.cursor = "col-resize";
//       document.body.style.userSelect = "none";
//     },
//     [width]
//   );

//   const handleMouseMove = useCallback(
//     (e) => {
//       if (!isResizing) return;

//       const deltaX = e.clientX - startXRef.current;
//       const newWidth = Math.max(
//         minWidth,
//         Math.min(maxWidth, startWidthRef.current + deltaX)
//       );

//       setWidth(newWidth);
//     },
//     [isResizing, minWidth, maxWidth]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsResizing(false);
//     document.body.style.cursor = "";
//     document.body.style.userSelect = "";
//   }, []);

//   useEffect(() => {
//     if (isResizing) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);

//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [isResizing, handleMouseMove, handleMouseUp]);

//   const handleDoubleClick = () => {
//     setWidth(defaultWidth);
//   };

//   return (
//     <div
//       ref={containerRef}
//       className="resizable-container"
//       style={{
//         width: `${width}px`,
//         position: "fixed",
//         height: "100%",
//         border: "1px solid black",
//         background: "#fff",
//         zIndex: 999,
//         right: 0,
//         top: 0,
//       }}
//     >
//       {/* Child Content */}
//       <div style={{ height: "100%", paddingRight: "8px" }}>{children}</div>

//       {/* Resize Handle - Now on the RIGHT side */}
//       <div
//         className={`resize-handle ${isResizing ? "resizing" : ""}`}
//         style={{
//           position: "absolute",
//           right: 0,
//           top: 0,
//           height: "20%",
//           width: "8px",
//           cursor: "col-resize",
//           zIndex: 10,
//           background: isResizing ? "rgba(0, 123, 255, 0.3)" : "transparent",
//         }}
//         onMouseDown={handleMouseDown}
//         onDoubleClick={handleDoubleClick}
//         title="Drag to resize | Double-click to reset"
//       />

//       {/* Show width while dragging */}
//       {isResizing && (
//         <div
//           style={{
//             position: "absolute",
//             top: "8px",
//             right: "16px",
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             color: "white",
//             padding: "4px 8px",
//             borderRadius: "4px",
//             fontSize: "12px",
//             zIndex: 20,
//             pointerEvents: "none",
//           }}
//         >
//           {width}px
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useRef, useCallback, useEffect } from "react";

export const ResizableComponent = ({
  children,
  defaultWidth = 275,
  minWidth = 200,
  maxWidth = 1200,
  onClose,
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [isResizing, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleDoubleClick = () => {
    setWidth(defaultWidth);
  };

  return (
    <div
      ref={containerRef}
      className="resizable-container"
      style={{
        width: `${width}px`,
        position: "fixed",
        height: "100%",
        border: "1px solid black",
        background: "#fff",
        zIndex: 999,
        right: 0,
        top: "80px",
      }}
    >
      <div style={{ height: "100%", paddingRight: "8px" }}>{children}</div>

      <div
        className={`resize-handle ${isResizing ? "resizing" : ""}`}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "20%",
          width: "8px",
          cursor: "col-resize",
          zIndex: 10,
          background: isResizing ? "rgba(0, 123, 255, 0.3)" : "transparent",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        title="Drag to resize | Double-click to reset"
      />

      {isResizing && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "16px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {width}px
        </div>
      )}
    </div>
  );
};
