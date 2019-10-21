const express = require("express");
const router = express.Router();
var multer = require("multer");
var fs = require("fs");
var path = require("path");
var upload = multer({ dest: "uploads/" });
const { Client } = require("../models/client");
const { Media } = require("../models/media");
const { Project } = require("../models/project");
const auth = require("../middleware/auth");
const filesPathArray = require("../middleware/filesPathArray");
const validateObjectId = require("../middleware/validateObjectId");

var storage = multer.diskStorage({
  //stockage des fichiers dans dossier public
  destination: function(req, file, cb) {
    var dir = "./public";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    const date = Date.now();
    cb(null, date + "-" + file.originalname);
    var fullpath = "http://localhost:3100/" + date + "-" + file.originalname;
    req.filesPaths.push(fullpath);
    //req.filesPaths est créer par le middleware  filesPathArray
  }
});
var upload = multer({ storage: storage }).array("file");

router.get("/", async (req, res) => {
  const clients = await Client.find();

  if (!clients)
    return res.status(404).send("The client with the given ID was not found.");

  res.status(200).send(clients);
});
router.get("/select", async (req, res) => {
  const clients = await Client.find().select({ name: 1 });

  if (!clients)
    return res.status(404).send("The client with the given ID was not found.");

  res.status(200).send(clients);
});

////// get a client by id
router.get("/:id", validateObjectId, async (req, res) => {
  let client = await Client.findById(req.params.id);

  if (!client)
    return res.status(404).send("The client with the given ID was not found.");
  const projects = await Project.find({ client: req.params.id }).select({
    title: 1,
    _id: 1,
    created_at: 1
  });
  //we want to have list of projects for the client but not all data of projects
  client.projects = projects;
  //console.log(client);
  res.status(200).send(client);
});

//////create a new Client
router.post("/new", [auth, filesPathArray, upload], async (req, res) => {
  const media = JSON.parse(req.body.media); //  object media inclue cover logo et selectedfiles(galarie)
  //upload de multer créer une array filespath dans chaque index est l'url de l'image saved pour chaque index d'object media
  //console.log(media)
  const data = JSON.parse(req.body.data);
  //console.log(data.description)
  let medias = [];
  //console.log(data)

  // stockage des files type url dans dossier nodjs  type : cover/logo/selectedFiles
  for (med in media) {
    let mediaElement = new Media({
      title: media[med].name,
      type: media[med].type,
      fileType: media[med].fileType,
      url: req.filesPaths[med]
    });
    //console.log(mediaElement)
    medias.push(mediaElement);
  }
  // creer un object client avec son media
  const client = new Client({
    name: data.title,
    description: data.description,
    webSite: data.webSite,
    medias: medias
  });
  //console.log(client)
  const result = await client.save();
  //console.log(result);
  return res.status(200).send(result._id);
});

// methode used to delete projects that has client id
//=> chaque client est referencer dans plusieurs projet d ou on doit les supprimer aussi
async function deleteProject(id) {
  //utiliser par le route delete client
  /// see methode in delete projects
  const project = await Project.findByIdAndRemove(id);
  if (!project) return false;
  for (let index = 0; index < project.medias.length; index++) {
    let arrayfileName = project.medias[index].url.split("/");
    const fileName = arrayfileName[arrayfileName.length - 1];
    let pathToFile = __dirname + "\\..\\public\\" + fileName;
    pathToFile = path.resolve(pathToFile);
    pathToFile = pathToFile.replace(/\\/g, "/");
    console.log(pathToFile);
    fs.unlink(pathToFile, function(err) {
      if (err) console.log("file don t existe ");
      console.log("File deleted!");
    });
  }
  return project;
}

//const projects = await Project.find({"client":req.params.id})
/// delete a client => delete all projects of client then delete client

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) return res.status(404).send("NO client with this id");
  //delete all projects of client id and all images included in public folder
  const projects = await Project.find({ client: req.params.id }); // find projects of this client
  console.log(projects.length);
  for (let index = 0; index < projects.length; index++) {
    //console.log(projects[index]._id)
    deleteProject(projects[index]._id);
  }
  //delete all pics/vids in public folder of client logo,cover
  for (let index = 0; index < client.medias.length; index++) {
    let arrayfileName = client.medias[index].url.split("/");
    const fileName = arrayfileName[arrayfileName.length - 1]; // get file name as savedin public folder
    let pathToFile = __dirname + "\\..\\public\\" + fileName;
    pathToFile = path.resolve(pathToFile);
    pathToFile = pathToFile.replace(/\\/g, "/"); // readable path by nodejs
    fs.unlink(pathToFile, function(err) {
      if (err) console.log("file don t existe ");
      // if no error, file has been deleted successfully
      console.log("File deleted!");
    });
  } //after deleting all files in public folder delete client
  const clientremoved = await Client.findByIdAndRemove(req.params.id);
  return res.status(200).send(clientremoved);
});

//////update Client
router.put("/:id", [auth, filesPathArray, upload], async (req, res) => {
  let client = await Client.findById(req.params.id);
  if (!client) return res.status(404).send("NO client with this id");

  const media = JSON.parse(req.body.media);

  const data = JSON.parse(req.body.data);

  const deleteMediaId = JSON.parse(req.body.deleteMediaId); /// media id s to be deleted

  for (let index = 0; index < client.medias.length; index++) {
    // supprimer les media déclarer par l'utilisateur
    if (deleteMediaId.includes(client.medias[index]._id.toString())) {
      let fullfilepath = client.medias[index].url.split("/");
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

  if (client.medias.length > 0) {
    client.medias = client.medias.filter(
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

    client.medias.push(mediaElement);
  }

  client.name = data.title;
  client.description = data.description;
  client.webSite = data.webSite;

  const result = await client.save();
  return res.status(200).send(result._id);
});

module.exports = router;
