const express = require("express");
const router = express.Router();
var multer = require("multer");
var fs = require("fs");
var upload = multer({ dest: "uploads/" });
const { Client } = require("../models/client");
const { Media } = require("../models/media");
const { Project } = require("../models/project");
const validateObjectId = require("../middleware/validateObjectId");
const filesPathArray = require("../middleware/filesPathArray");
const auth = require("../middleware/auth");
var path = require("path");

//const {mediaSchema} =require("../models/media");

var storage = multer.diskStorage({
  // stockage des fichier dans le dossier public
  destination: function(req, file, cb) {
    var dir = "./public";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    //console.log("1");
    const date = Date.now();
    cb(null, date + "-" + file.originalname);
    var fullpath = "http://localhost:3100/" + date + "-" + file.originalname;
    req.filesPaths.push(fullpath);
    //req.filesPaths est créer par le middleware  filesPathArray
  }
});

var upload = multer({ storage: storage }).array("file");

router.get("/", async (req, res) => {
  const projects = await Project.find().populate("client", "name");

  if (!projects) return res.status(404).send("No project with this Id");

  res.status(200).send(projects);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "client",
    "name"
  );

  if (!project) return res.status(404).send("NO project with this id");

  res.status(200).send(project);
});

router.post("/new", [auth, filesPathArray, upload], async (req, res) => {
  const media = JSON.parse(req.body.media);
  //console.log(media)
  const data = JSON.parse(req.body.data);
  let medias = [];
  //console.log(data)
  for (med in media) {
    //stockage des media pour le project cover/logo/selectedFiles(galarie)
    let mediaElement = new Media({
      title: media[med].name,
      type: media[med].type,
      fileType: media[med].fileType,
      url: req.filesPaths[med] //lient créer aprés stockage avec multer
    });
    //console.log(mediaElement)
    medias.push(mediaElement);
  }
  const project = new Project({
    title: data.title,
    description: data.description,
    content: data.content,
    client: data.client,
    medias: medias
  });
  const result = await project.save();
  //console.log(result);
  return res.status(200).send(result._id);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const project = await Project.findByIdAndRemove(req.params.id);

  if (!project) return res.status(404).send("NO project with this id");

  for (let index = 0; index < project.medias.length; index++) {
    let arrayfileName = project.medias[index].url.split("/");
    const fileName = arrayfileName[arrayfileName.length - 1]; // get file name as savedin public folder
    let pathToFile = __dirname + "\\..\\public\\" + fileName;
    pathToFile = path.resolve(pathToFile);
    pathToFile = pathToFile.replace(/\\/g, "/");
    console.log(pathToFile);
    fs.unlink(pathToFile, function(err) {
      if (err) console.log("file don t existe ");
      // if no error, file has been deleted successfully
      console.log("File deleted!");
    });
  } //after deleting all files in public folder delete project
  res.status(200).send(project);
});

router.put("/:id", [auth, filesPathArray, upload], async (req, res) => {
  let project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("NO project with this id");

  const media = JSON.parse(req.body.media);

  const data = JSON.parse(req.body.data);

  const deleteMediaId = JSON.parse(req.body.deleteMediaId); /// media id s to be deleted

  for (let index = 0; index < project.medias.length; index++) {
    if (deleteMediaId.includes(project.medias[index]._id.toString())) {
      let fullfilepath = project.medias[index].url.split("/");
      const fileName = fullfilepath[fullfilepath.length - 1]; // get file name as savedin public folder
      let pathToFile = __dirname + "\\..\\public\\" + fileName;
      pathToFile = path.resolve(pathToFile);
      pathToFile = pathToFile.replace(/\\/g, "/");
      fs.unlink(pathToFile, function(err) {
        if (err) console.log("file don t existe ");
        console.log("File deleted!");
      });
    }
  }

  if (project.medias.length > 0) {
    project.medias = project.medias.filter(
      m => !deleteMediaId.includes(m._id.toString())
    );
  }
  for (med in media) {
    let mediaElement = new Media({
      title: media[med].name,
      type: media[med].type,
      fileType: media[med].fileType,
      url: req.filesPaths[med]
    });

    project.medias.push(mediaElement);
  }

  project.title = data.title;
  project.description = data.description;
  project.content = data.content;
  project.client = data.client;

  const result = await project.save();
  return res.status(200).send(result._id);
});

module.exports = router;
