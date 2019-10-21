import React, { useState, useEffect } from "react";
import { getProject } from "../Services/projectService";
import { toast } from "react-toastify";
import PreviewMarked from "./../common/PreviewMarked";
import showImageVideo from "./../ReUseFonctions/showImageVideo";

export default function Project(props) {
  const [project, setProject] = useState(null);
  const [cover, setCover] = useState(null);
  const [logo, setLogo] = useState(null);
  const [medias, setMedias] = useState(null);
  useEffect(() => {
    const fillProject = async () => {
      try {
        const { data: theProject } = await getProject(props.match.params.id);
        setProject(theProject);
        if (theProject.medias.length > 0) {
          const Thelogo = theProject.medias.filter(
            media => media.type === "logo"
          );
          Thelogo[0].url = Thelogo[0].url.replace("\\", "/");
          setLogo(Thelogo);
          const Thecover = theProject.medias.filter(
            media => media.type === "cover"
          );
          Thecover[0].url = Thecover[0].url.replace("\\", "/");
          setCover(Thecover);
          const theMedias = theProject.medias.filter(
            media => media.type !== "cover" && media.type !== "logo"
          );
          for (let index = 0; index < theMedias.length; index++) {
            theMedias[index].url = theMedias[index].url.replace("\\", "/");
          }

          setMedias(theMedias);
        }
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error(ex.response.message.data);
          props.history.push("/not-found");
        } else {
          toast.error("no server connxion");
          props.history.push("/");
        }
      }
    };
    fillProject();
  }, [props]);

  if (project && logo && cover && medias) {
    return (
      <div>
        <div className="d-flex    bg-info text-white " style={{ padding: 5 }}>
          <img
            className="mr-3"
            src={logo[0].url}
            alt={logo[0].type}
            width="100"
            height="48"
          />
          <div>
            <h2 style={{ textAlign: "center", width: "100%" }}>
              Project : {project.title}
            </h2>
          </div>
        </div>
        <React.Fragment>
          <header
            className="masthead"
            style={{
              padding: 10,
              backgroundImage: `url(${cover[0].url})`,
              width: "100%",
              height: 500,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover"
            }}
          >
            <div className="container h-100">
              <div className="row h-100 align-items-center justify-content-center text-center">
                <div
                  className="col-lg-10 align-self-end"
                  style={{
                    backgroundColor: "black",
                    opacity: "0.7",

                    margin: "auto",
                    borderRadius: 20
                  }}
                >
                  <h1 className="text-uppercase text-white font-weight-bold">
                    {project.title}
                  </h1>
                  <p className="text-white font-weight-bold">
                    {project.description}
                  </p>
                  <hr className="divider my-4"></hr>
                </div>
                <div className="col-lg-8 align-self-baseline">
                  <a href={"/clients/" + project.client._id}>
                    <button className="btn btn-primary" style={{ margin: 10 }}>
                      {" "}
                      BY {project.client.name}
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </header>
        </React.Fragment>
        <div className="d-flex  p-3  bg-primary text-white ">
          <div className="lh-100">
            <h6>
              {" "}
              Client :{" "}
              <a
                href={"/clients/" + project.client._id}
                style={{ color: "#01DFA5" }}
              >
                {project.client.name}
              </a>{" "}
              <small style={{ marginLeft: 100 }}>
                {" "}
                Project Created : {project.created_at.slice(0, 10)}
              </small>
            </h6>
          </div>
        </div>

        <div style={{ width: "80%", margin: "auto" }}>
          <div style={{ marginTop: 20 }}>
            <PreviewMarked content={project.content}></PreviewMarked>
          </div>

          {/* <previewImages medias={medias} ></previewImages> */}

          <div id="preview">
            <h3>Galerie</h3>
            <section id="portfolio">
              <div className="container-fluid p-0" style={{ margin: 10 }}>
                <div class="row no-gutters">
                  {medias.map(m => showImageVideo(m))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>LOADING....</h1>
      </div>
    );
  }
}
