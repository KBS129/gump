import { PropsWithChildren } from "react";

function Backdrop(props: PropsWithChildren) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/75 z-10 grid place-items-center">
      {props.children}
    </div>
  );
}

export default Backdrop;
