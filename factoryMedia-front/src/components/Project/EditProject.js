import React, { useState, useEffect } from "react";
import Joi from "joi-browser";
import {
  validateProperty,
  RenderInput,
  RenderTextarea,
  RenderButton,
  RenderSelect,
  RenderUpload,
  validate
} from "../common/FormHolder";
import { toast } from "react-toastify";
import http from "../Services/httpService";
import config from "../../config.json";
import PreviewMarked from "../common/PreviewMarked";
import { getProject } from "../Services/projectService";

export default function EditProject(props) {
  const [allData, setData] = useState({
    title: "",
    description: "",
    content: "",
    client: ""
  });
  const [allMedia, setMedia] = useState([]);
  const [allFiles, setFiles] = useState([]);
  const [inputErrors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [cover, setCover] = useState(null); /// used to show cover
  const [logo, setLogo] = useState(null); /// used to show logo
  const [medias, setMedias] = useState(null); // for galarie images
  const [mediaIdToDelete, SetDeleteMedia] = useState([]);
  const schema = {
    title: Joi.string()
      .required()
      .min(3)
      .label("Title"),
    description: Joi.string()
      .required()
      .min(12)
      .label("Description"),
    content: Joi.string()
      .required()
      .min(12)
      .label("Content"),
    client: Joi.label("Client")
  };

  useEffect(() => {
    //console.log('----')
    async function fetchClients() {
      try {
        const res = await http.get(config.ApiBackend + "/clients/select");
        if (res.data.length === 0) {
          toast.info("create a user to full the project");
          setTimeout(() => {
            props.history.push(`/`);
          }, 2000);
          return false;
        }
        setClients(res.data);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          toast.error("server internal error...redirect home");
          setTimeout(() => {
            props.history.push(`/`);
          }, 2000);
          return false;
        } else {
          toast.error("no server connxion...redirect home");
          setTimeout(() => {
            props.history.push(`/`);
          }, 2000);
          return false;
        }
      }
    }
    fetchClients();

    const fillProject = async () => {
      try {
        const { data: project } = await getProject(props.match.params.id);
        const data = {
          title: project.title,
          description: project.description,
          content: project.content,
          client: project.client._id
        };
        setData(data);
        if (project.medias.length > 0) {
          const Thelogo = project.medias.filter(m => m.type === "logo");
          Thelogo[0].url = Thelogo[0].url.replace("\\", "/");
          setLogo(Thelogo);
          //console.log(Thelogo)
          const Thecover = project.medias.filter(m => m.type === "cover");
          Thecover[0].url = Thecover[0].url.replace("\\", "/");
          setCover(Thecover);
          const galarie = project.medias.filter(
            m => m.type !== "cover" && m.type !== "logo"
          );
          galarie[0].url = galarie[0].url.replace("\\", "/");
          setMedias(galarie);
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

  const handleChange = ({ currentTarget: input }) => {
    //console.log(input.value)
    const errors = { ...inputErrors };
    const errorMessage = validateProperty(input.name, input.value, schema);
    if (errorMessage) {
      errors[input.name] = errorMessage;
      setErrors(errors);
    } else delete errors[input.name];
    const data = { ...allData };
    //console.log(input.name,input.value)
    data[input.name] = input.value;
    setData(data);
    setErrors(errors);
  };

  const handleFileChange = e => {
    for (let index = 0; index < e.target.files.length; index++) {
      if (
        e.target.files[index].type.slice(0, 5) !== "image" &&
        e.target.files[index].type.slice(0, 5) !== "video"
      ) {
        const errors = { ...inputErrors };
        errors[e.target.name] =
          "insert a valid image or video- file will not be sent to server";
        setErrors(errors);
        return false;
      }
    }

    const name = e.currentTarget.name;
    const media = [];
    const medias = [...allMedia]; /// variable to push into medias object to be sent into back end
    const files = [];
    const myfiles = [...allFiles]; /// varible to push new files in array of files to be sent to teh backend

    for (let med = 0; med < medias.length; med++) {
      if (medias[med].type !== name) {
        // we delete all medias and files from state equal to type =>ex :"cover","logo",...
        media.push(medias[med]);
        files.push(myfiles[med]);
      }
    }

    for (let index = 0; index < e.target.files.length; index++) {
      let mediadata = { name: "", type: "", fileType: "" };
      mediadata.type = name;
      mediadata.name = e.target.files[index].name;
      mediadata.fileType = e.target.files[index].type;
      files.push(e.target.files[index]);
      media.push(mediadata);
    }
    setMedia(media);
    setFiles(files);
    return true;
  };

  const doSubmit = async () => {
    const data = { ...allData };
    const media = { ...allMedia };
    const deleteMediaId = [...mediaIdToDelete];
    //console.log(data,media)
    const finalProject = new FormData();
    for (var x = 0; x < allFiles.length; x++) {
      finalProject.append("file", allFiles[x]);
    }
    //console.log(this.state.media);
    finalProject.append("data", JSON.stringify(data));
    finalProject.append("media", JSON.stringify(media));
    finalProject.append("deleteMediaId", JSON.stringify(deleteMediaId));
    // console.log(finalProject)
    try {
      const res = await http.put(
        config.ApiBackend + "/projects/" + props.match.params.id,
        finalProject
      );
      props.history.push("/projects/" + res.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("server side isn't found");
      } else {
        toast.error("no server connxion...redirect home");
        props.history.push("/home");
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validate(allData, schema);
    setErrors(errors || {});
    if (errors) return;
    //console.log("---")
    doSubmit();
  };

  const deleteLogo = _id => {
    //const OurLogo = { ...logo }; ///logo objects of array s in case many logos were pushed we treat first
    setLogo(null); /// we set logo to null until change to push new logo
    const mediaIdDelete = [...mediaIdToDelete]; /// we add to state the id of the recent delete media
    mediaIdDelete.push(_id);
    SetDeleteMedia(mediaIdDelete);
  };
  ///delete cover file
  const deleteCover = _id => {
    //const OurLogo = { ...logo }; ///logo objects of array s in case many logos were pushed we treat first
    setCover(null); /// we set logo to null until change to push new logo
    const mediaIdDelete = [...mediaIdToDelete]; /// we add to state the id of the recent delete media
    mediaIdDelete.push(_id);
    SetDeleteMedia(mediaIdDelete);
  };

  const deletefromGalarie = _id => {
    const galarie = medias.filter(m => m._id !== _id);
    const mediaIdDelete = [...mediaIdToDelete]; /// we add to state the id of the recent delete media
    mediaIdDelete.push(_id);
    SetDeleteMedia(mediaIdDelete);
    setMedias(galarie);
  };

  return (
    <div
      className="container"
      style={{
        width: "80%",
        margin: "auto",
        padding: 10
      }}
    >
      <div style={{ margin: 40 }}>
        <h4>Create anEvent/Project</h4>
      </div>

      <form style={{}} onSubmit={handleSubmit} encType="multipart/form-data">
        {RenderInput("title", "Title", allData, inputErrors, handleChange)}
        {RenderSelect(
          "client",
          "Client",
          clients,
          allData,
          inputErrors,
          handleChange
        )}
        {RenderTextarea(
          "description",
          "Description",
          allData,
          inputErrors,
          handleChange
        )}
        {RenderTextarea(
          "content",
          "Content",
          allData,
          inputErrors,
          handleChange
        )}
        <div>
          <label style={{ color: "blue" }}>Preview of Content</label>
          <PreviewMarked content={allData.content}></PreviewMarked>
        </div>
        {cover && (
          <div className="card" style={{ width: "18rem" }}>
            <img
              src={cover[0].url}
              className="card-img-top"
              alt={cover[0].title}
            />

            <div className="card-body">
              <button
                className="btn btn-danger"
                onClick={e => deleteCover(cover[0]._id)}
              >
                delete cover
              </button>
            </div>
          </div>
        )}
        {RenderUpload(
          "cover",
          "Cover Image",
          inputErrors,
          handleFileChange,
          false
        )}
        {logo && (
          <div className="card" style={{ width: "18rem" }}>
            <img
              src={logo[0].url}
              className="card-img-top"
              alt={logo[0].title}
            />

            <div className="card-body">
              <button
                className="btn btn-danger"
                onClick={e => deleteLogo(logo[0]._id)}
              >
                delete logo
              </button>
            </div>
          </div>
        )}
        {RenderUpload("logo", "Logo", inputErrors, handleFileChange, false)}
        {medias &&
          medias.map(m => (
            <div className="card" style={{ width: "18rem" }} key={m._id}>
              <img src={m.url} className="card-img-top" alt={m.title} />

              <div className="card-body">
                <button
                  className="btn btn-danger"
                  onClick={e => deletefromGalarie(m._id)}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        {RenderUpload(
          "selectedFiles",
          "Galarie",
          inputErrors,
          handleFileChange,
          true
        )}
        {RenderButton("Update Project", allData, schema)}
      </form>
    </div>
  );
}
