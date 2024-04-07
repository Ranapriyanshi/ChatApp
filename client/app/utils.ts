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

export { debounceCallback };
