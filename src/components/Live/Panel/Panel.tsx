import { ReactElement } from "react";
import "./panel.css";

interface Props {
  children?: ReactElement;
  position: "left" | "right";
}

const Panel = ({ children, position }: Props) => {
  return <section className={`panel ${position}`}>{children}</section>;
};

export default Panel;
