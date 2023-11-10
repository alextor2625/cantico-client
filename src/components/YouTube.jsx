import React from "react";

let dynamicSrc = "https://www.youtube.com/embed/Y3puNlFBqvo?controls=0&rel=0&modestbranding=1";

const YouTube = () => {
  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={dynamicSrc}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoPlay; clipboardWrite; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default YouTube;
