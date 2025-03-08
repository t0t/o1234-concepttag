import React from "react";
import Draggable from "react-draggable";

const DraggableWrapper = (props) => {
  const { children, ...rest } = props;
  return React.createElement(Draggable, rest, children);
};

export default DraggableWrapper;
