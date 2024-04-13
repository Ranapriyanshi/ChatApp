import { Bounce, toast, TypeOptions } from "react-toastify";

function debounceCallback(fn: Function, delay: number) {
  const cb = (func: Function) => {
    let timeout: NodeJS.Timeout;
    return (args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(args);
      }, delay);
    };
  };

  return cb(fn);
}

function toaster (type: string, msg: string) {
    toast(msg, {
      type: type as TypeOptions,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
}

export { debounceCallback, toaster };
