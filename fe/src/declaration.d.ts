declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' {
  const imageSrc: string;
  export default imageSrc;
}

declare module '*.jpg' {
  const imageSrc: string;
  export default imageSrc;
}
