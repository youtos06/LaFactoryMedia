import React from "react";

export default function showImageVideo(file) {
  const type = file.fileType;
  console.log(type);
  if (type.slice(0, 5) === "image") {
    return (
      <div class="col-lg-4 col-sm-6" style={{ margin: "10px" }}>
        <a href={file.url}>
          <img
            style={{ width: 650, height: 250 }}
            class="img-fluid"
            src={file.url}
            alt={file.title}
          />
          <div class="portfolio-box-caption">
            <div class="project-name">
              {file.title.slice(0, file.title.length - 4)}
            </div>
          </div>
        </a>
        <div className="desc"></div>
      </div>
    );
  } else if (type.slice(0, 5) === "video") {
    return (
      <div class="col-lg-4 col-sm-6" style={{ margin: "10px" }}>
        <a href={file.url}>
          <video controls style={{ width: 550, height: 250 }}>
            <source
              src={file.url}
              type={file.fileType}
              alt={file.title}
              controls
              style={{ width: 550, height: 250 }}
            />
            <p>Votre navigateur ne prend pas en charge les vidéos HTML5.</p>
          </video>
          <div class="portfolio-box-caption">
            <div class="project-name">
              {file.title.slice(0, file.title.length - 4)}
            </div>
          </div>
        </a>
        <div className="desc"></div>
      </div>
    );
  } else {
    return <div></div>;
  }
}
