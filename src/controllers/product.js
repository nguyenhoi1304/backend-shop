const ProductModel = require("../models/product");

exports.findAll = async (req, res, next) => {
  //Hiển thị tất cả sản phẩm
  const data = await ProductModel.find();
  res.json(data);
};
exports.pagination = async (req, res, next) => {
  const { category, count, page, search } = req.query;
  // nhận vào page = 1 , count = 6 , search = value
  const paginatedResults = (productArr, page, count) => {
    // tìm vị trí bắt đầu và kết thúc trang theo index
    const startIndex = (page - 1) * count;
    const endIndex = page * count;

    const results = {};
    if (endIndex < productArr.length) {
      results.next = {
        page: page + 1,
        count: count,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        count: count,
      };
    }

    results.results = productArr.slice(startIndex, endIndex);

    return results;
  };

  // nếu người dùng search
  const allProduct = search
    ? await ProductModel.find({
        name: { $regex: new RegExp(search, "i") },
      }).lean() //Tìm trong name có chứa chuỗi ký tự người dùng nhập
    : await ProductModel.find().lean();

  //Tìm theo category bắt đầu chữ cái không phân biệt in hoa hay in thường
  const categoryProduct = await ProductModel.find({
    category: { $regex: new RegExp(category, "i") },
  }).lean();

  const result = paginatedResults(
    category == "all" ? allProduct : categoryProduct,
    page,
    count
  );
  res.json(result.results);
};

//Create Product
exports.add = async (req, res, next) => {
  const newProduct = await ProductModel.create(req.body);
  try {
    res.status(200).json(newProduct);
  } catch (err) {
    next(err);
  }
};

//UPDATE Product
exports.putProduct = async (req, res, next) => {
  try {
    // Tìm id và nội dung cần update
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};
//DELETE Product
exports.deleteProduct = async (req, res, next) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

exports.detail = async (req, res, next) => {
  const idProduct = req.params.id;
  try {
    //Lấy thông tin sản phẩm theo id
    const productDetail = await ProductModel.findById(idProduct);
    res.json(productDetail);
  } catch (err) {
    console.log(err);
  }
};
