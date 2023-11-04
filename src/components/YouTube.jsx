import React from "react";

let dynamicSrc =
  "https://www.youtube.com/embed/Y3puNlFBqvo?si=tcDSTfyrLBDH1sVz&amp;controls=0";

const YouTube = () => {
  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={dynamicSrc}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoPlay; clipboardWrite; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </div>
  );
};

export default YouTube;
