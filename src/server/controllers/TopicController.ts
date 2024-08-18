import Controller from "$/server/core/Controller.js";
import topicModel from "$/server/models/topic.model.js";
import type { Request, Response } from "express";

@Controller.Prefix("/api/v1/topics")
export default class TopicController extends Controller {
  @Controller.Get("")
  async getAll(_req: Request, res: Response) {
    res.json(await topicModel.findAll());
  }

  @Controller.Get("/one")
  async getOne(req: Request, res: Response) {
    const { id, slug } = req.query;

    if (typeof id === "string") {
      res.json(await topicModel.findOneById(+id));
      return;
    }

    if (typeof slug === "string") {
      res.json(await topicModel.findOneBySlug(slug));
      return;
    }

    res.json(null);
  }

  @Controller.Post("")
  async add(req: Request, res: Response) {
    const data = req.body;
    res.json(await topicModel.add(data));
  }

  @Controller.Patch("/:id")
  async update(req: Request, res: Response) {
    const data = req.body;
    res.json(await topicModel.update(data));
  }

  @Controller.Delete("/:id")
  async deleteOne(req: Request, res: Response) {
    const id = +req.params.id;
    res.json(await topicModel.delete(id));
  }
}