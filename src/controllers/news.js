const NewsModel = require("../models/news");

exports.getAllNews = async (req, res, next) => {
  const dataNews = await NewsModel.find();
  res.json(dataNews);
};

exports.createNews = async (req, res, next) => {
  const { title, image, description } = req.body;
  if (!title && !image && !description) {
    res.status(500).json({ err: "Create fail" });
  } else {
    const result = await NewsModel.create({
      title: title,
      image: image,
      description: description,
    });
    res.status(200).json(result);
  }
};
