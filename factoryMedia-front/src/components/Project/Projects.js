import React, { useState, useEffect } from "react";
import { allProjects, deleteProject } from "../Services/projectService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../Services/authService";
function Projects(props) {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const deleteThisProject = async _id => {
    try {
      await deleteProject(_id);
      //debugger;
      const allprojects = projects.filter(p => p._id !== _id);
      setProjects(allprojects);
    } catch (ex) {
      //debugger;
      if (ex.response && ex.response.status === 404) {
        toast.error(ex.response.message.data);
      } else {
        toast.error("no server connxion");
      }
    }
  };

  useEffect(() => {
    const fetchProjectsFromServer = async () => {
      try {
        const { data: project } = await allProjects();
        if (project) {
          //const project = project;
          //console.log(project)
          for (let index = 0; index < project.length; index++) {
            if (project[index].medias.length > 0) {
              project[index].medias.filter(media => media.type === "logo");
              project[index].medias[0].url = project[
                index
              ].medias[0].url.replace("\\", "/");
            }
          }
          setUser(getCurrentUser);
          setProjects(project);
          //console.log(projects)
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
    fetchProjectsFromServer();
  }, [props]);

  return (
    <div style={{ padding: 10 }}>
      <h2 style={{ textAlign: "center" }}>
        la liste de nos Project
        {user && (
          <Link to="/project/new">
            <button className="btn btn-info" style={{ marginLeft: 10 }}>
              {" "}
              créer un nouveau utilisateur
            </button>
          </Link>
        )}
      </h2>
      <ul className="list-unstyled">
        {projects &&
          projects.map(project => (
            <div
              className="card text-center"
              key={project._id}
              style={{
                maxWidth: 900,
                margin: "auto",
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <div className="card-header">{project.title}</div>
              <div className="card-body">
                {project.medias.length > 0 && (
                  <img
                    src={project.medias[0].url}
                    className="mr-3"
                    style={{ width: 64, height: 64 }}
                    alt={project.title}
                  />
                )}
                <p className="card-text">{project.description}</p>
                <a href={`/projects/${project._id}`}>Visit Project</a>
                {user && (
                  <>
                    <a href={`/projects/${project._id}/edit`}>
                      <button
                        className="btn btn-info"
                        style={{ marginLeft: 10 }}
                      >
                        modifier
                      </button>
                    </a>
                    <button
                      className="btn btn-danger"
                      onClick={e => deleteThisProject(project._id)}
                      style={{ marginLeft: 10 }}
                    >
                      delete Project
                    </button>
                  </>
                )}
              </div>
              <div className="card-footer text-muted">{project.created_at}</div>
            </div>
          ))}
      </ul>
    </div>
  );
}
export default Projects;
