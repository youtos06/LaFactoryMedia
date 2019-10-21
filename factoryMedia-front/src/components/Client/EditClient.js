import React, { useState, useEffect } from "react";
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
import { getClient } from "../Services/clientService";

export default function EditClient(props) {
  const [allData, setData] = useState({
    title: "",
    description: "",
    webSite: ""
  });
  const [allMedia, setMedia] = useState([]); /// used to send media object
  const [allFiles, setFiles] = useState([]); /// used to send files
  const [inputErrors, setErrors] = useState({});
  const [cover, setCover] = useState(null); /// used to show cover
  const [logo, setLogo] = useState(null); /// used to show logo
  const [mediaIdToDelete, SetDeleteMedia] = useState([]); // array for media id s to be deleted in the backend
  // construct a client obecjt to send and send images id to delete
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
  /// get client with current id
  useEffect(() => {
    const fillClient = async () => {
      try {
        const { data: client } = await getClient(props.match.params.id);
        const data = {
          title: client.name,
          description: client.description,
          webSite: client.webSite
        };
        setData(data);
        if (client.medias.length > 0) {
          const Thelogo = client.medias.filter(media => media.type === "logo");
          Thelogo[0].url = Thelogo[0].url.replace("\\", "/");
          setLogo(Thelogo);
          //console.log(Thelogo)
          const Thecover = client.medias.filter(
            media => media.type === "cover"
          );
          Thecover[0].url = Thecover[0].url.replace("\\", "/");
          setCover(Thecover);
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
    fillClient();
  }, [props]);
  /// input changes
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
  ///delete logo file
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
  /// file changes
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

    const name = e.currentTarget.name; /// name here describe type cover,logo...
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
    // now we free images from view of user
    if (name === "logo" && logo) {
      deleteLogo(logo[0]._id);
    }
    if (name === "cover" && cover) {
      deleteCover(cover[0]._id);
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
  /// submit and send to back end
  const doSubmit = async () => {
    const data = { ...allData };
    const media = { ...allMedia };
    const deleteMediaId = [...mediaIdToDelete];
    const clientProject = new FormData();
    for (var x = 0; x < allFiles.length; x++) {
      clientProject.append("file", allFiles[x]);
    }
    clientProject.append("data", JSON.stringify(data));
    clientProject.append("media", JSON.stringify(media));
    clientProject.append("deleteMediaId", JSON.stringify(deleteMediaId));
    try {
      const res = await http.put(
        config.ApiBackend + "/clients/" + props.match.params.id,
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
  /// initial verification on click submit
  const handleSubmit = e => {
    e.preventDefault();
    const errors = validate(allData, schema);
    setErrors(errors || {});
    if (errors) return;
    //console.log("---")
    doSubmit();
  };

  /// our view of course
  return (
    <div
      className="container"
      style={{
        width: "80%",
        margin: "auto",
        padding: 10
      }}
    >
      <div>
        <h1>Create a Client</h1>
      </div>

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
        {RenderUpload(
          "logo",
          "Logo Image",
          inputErrors,
          handleFileChange,
          false
        )}
        {RenderButton("Update Client", allData, schema)}
      </form>
    </div>
  );
}
