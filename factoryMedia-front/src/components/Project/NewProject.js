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

export default function NewProject(props) {
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
    async function fetchData() {
      try {
        const res = await http.get(config.ApiBackend + "/clients/select");
        const data = { ...allData };
        data.client = res.data[0]._id;
        if (res.data.length === 0) {
          toast.info("create a user to full the project");
          setTimeout(() => {
            props.history.push(`/`);
          }, 2000);
          return false;
        }

        setData(data);
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
    if (allData.client === "") {
      fetchData();
    }
  }, [allData, props]);

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
    //console.log(data);
    //console.log(allData)
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
    //console.log(data,media)
    const clientProject = new FormData();
    for (var x = 0; x < allFiles.length; x++) {
      clientProject.append("file", allFiles[x]);
    }
    //console.log(this.state.media);
    clientProject.append("data", JSON.stringify(data));
    clientProject.append("media", JSON.stringify(media));
    // console.log(clientProject)
    try {
      const res = await http.post(
        config.ApiBackend + "/projects/new",
        clientProject
      );
      props.history.push("/projects/" + res.data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        alert("server side isn't found");
      } else {
        toast.error("no server connxion");
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
        {RenderUpload(
          "cover",
          "Cover Image",
          inputErrors,
          handleFileChange,
          false
        )}
        {RenderUpload("logo", "Logo", inputErrors, handleFileChange, false)}
        {RenderUpload(
          "selectedFiles",
          "Galarie",
          inputErrors,
          handleFileChange,
          true
        )}
        {RenderButton("Create Project", allData, schema)}
      </form>
    </div>
  );
}
