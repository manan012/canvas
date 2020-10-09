const route = require("express").Router();
const jspdf = require("jspdf");
const base64 = require("base64topdf");
const fs = require("fs");
const path = require("path");

var pdf = new (require("pdfkit"))({
  autoFirstPage: false,
});

const ImagesToPDF = require("images-pdf");

const { v1: uuidv1 } = require("uuid");

exports.download = (req, res, next) => {
  const imgPath = req.query.path;
  var file = path.join(__dirname, "../", "images/", imgPath, "/out.pdf");
  if(fs.existsSync(file)) {
    console.log('filejgj',file);
  } else {
    console.log('nooooo');
    }  
  
  
  res.sendFile(file, function (err) {
    if (err) {
      console.log("Error");
      console.log(err);
    } else {
      console.log("Success");
    }
  });
};

// exports.sendFile = (req, res, next) => {
//     var data = req.body.data;
//     const pdf = new jspdf({
//         orientation: 'landscape',
//       });
//       const imgProp = pdf.getImageProperties(base64URL);
//       const width = pdf.internal.pageSize.getWidth();
//       const height = (imgProp.height * width) / imgProp.width;
//       pdf.addImage(base64URL, 'PNG', 0, 0, width, height);
//       res.setHeader('Content-Type', 'application/pdf');
//       res.sendFile(pdf);

// }

exports.sendFile = (req, res, next) => {
  var data = req.body.data;
  console.log(data);
  const imgPath = uuidv1();

  var dir = path.join(__dirname, "../images/" + imgPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  //console.log(pdfDir);
  fs.writeFileSync(dir + "/out.jpg", data, { encoding: "base64" }, function (
    err
  ) {
    console.log("hii", err);
  });

  new ImagesToPDF.ImagesToPDF().convertFolderToPDF(dir, dir + "/out.pdf");
  var file = path.join(__dirname, "../", "images/", imgPath, "/out.pdf");

  return res.status(200).json({
    path: imgPath,
  });
};
