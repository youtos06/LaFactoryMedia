import React, { useState } from "react";
import Joi from "joi-browser";
import {
  validateProperty,
  RenderInput,
  RenderTextarea,
  RenderButton,
  RenderUpload,
  validate
} from "../common/FormHolder";
import { toast } from "react-toastify";
import http from "../Services/httpService";
import config from "../../config.json";

export default function NewClient(props) {
  const [allData, setData] = useState({
    title: "",
    description: "",
    webSite: ""
  });
  const [allMedia, setMedia] = useState([]);
  const [allFiles, setFiles] = useState([]);
  const [inputErrors, setErrors] = useState({});

  const schema = {
    title: Joi.string()
      .required()
      .min(3)
      .label("Title"),
    description: Joi.string()
      .required()
      .min(12)
      .label("Description"),
    webSite: Joi.string().label("Web Site Link")
  };

  const handleChange = ({ currentTarget: input }) => {
    const errors = { ...inputErrors };
    const errorMessage = validateProperty(input.name, input.value, schema);
    if (errorMessage) {
      errors[input.name] = errorMessage;
      setErrors(errors);
    } else delete errors[input.name];
    const data = { ...allData };
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
    const clientProject = new FormData();
    for (var x = 0; x < allFiles.length; x++) {
      clientProject.append("file", allFiles[x]);
    }
    clientProject.append("data", JSON.stringify(data));
    clientProject.append("media", JSON.stringify(media));
    try {
      const res = await http.post(
        config.ApiBackend + "/clients/new",
        clientProject
      );
      props.history.push("/clients/" + res.data);
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

  return (
    <div
      className="container"
      style={{
        width: "80%",
        margin: "auto",
        padding: 10
      }}
    >
      <h1 style={{ textAlign: "center" }}>Create a Client</h1>

      <form style={{}} onSubmit={handleSubmit} encType="multipart/form-data">
        {RenderInput("title", "Title", allData, inputErrors, handleChange)}
        {RenderTextarea(
          "description",
          "Description",
          allData,
          inputErrors,
          handleChange
        )}
        {RenderInput(
          "webSite",
          "Web Site Link",
          allData,
          inputErrors,
          handleChange
        )}
        {RenderUpload(
          "cover",
          "Cover Image",
          inputErrors,
          handleFileChange,
          false
        )}
        {RenderUpload(
          "logo",
          "Logo Image",
          inputErrors,
          handleFileChange,
          false
        )}
        {RenderButton("Create Client", allData, schema)}
      </form>
    </div>
  );
}
