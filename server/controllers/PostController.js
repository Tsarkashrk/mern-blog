import PostSchema from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate("user").exec();
    res.json(posts);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалость получить статьи"
    })
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostSchema.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      {
        new: true, 
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена",
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось получить статью",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostSchema.findOneAndDelete(
      {
        _id: postId
      }
    );

    if (!doc) {
      return res.status(404).json({
        message: "Статья не найдена"
      });
    }

    res.json({
      success: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось удалить статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostSchema.updateOne(
      {
        _id: postId
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags
      }
    );

    res.json({
      success: true
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      viewsCount: req.body.viewsCount,
      user: req.userId
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать статью",
    })
  }
};

