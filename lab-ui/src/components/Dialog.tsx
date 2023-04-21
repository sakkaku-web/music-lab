import { PropsWithChildren } from "react";

interface DialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
}

export function Dialog({ open, children, onClose }: DialogProps) {
  const opacity = open ? "opacity-100" : "opacity-0";
  const scale = open ? "scale-100" : "scale-0";

  return (
    <div
      className={`flex backdrop-blur items-center justify-center fixed top-0 bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${scale} ${opacity}`}
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      <div className="-z-10 absolute w-full h-full" onClick={() => onClose()}></div>
      {children}
    </div>
  );
}
