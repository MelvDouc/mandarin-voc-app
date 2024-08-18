import Controller from "$/server/core/Controller.js";
import tagModel from "$/server/models/tag.model.js";
import type { Request, Response } from "express";

@Controller.Prefix("/api/v1/tags")
export default class TagController extends Controller {
  @Controller.Get("")
  async getAll(req: Request, res: Response) {
    res.json(await tagModel.findAll());
  }

  @Controller.Get("/:value")
  async getAllByValue(req: Request, res: Response) {
    res.json(await tagModel.findByValue(req.params.value));
  }

  @Controller.Post("")
  async add(req: Request, res: Response) {
    const data = req.body;
    res.json(await tagModel.add(data));
  }

  @Controller.Patch("/:id")
  async update(req: Request, res: Response) {
    const data = req.body;
    res.json(await tagModel.update(data));
  }

  @Controller.Delete("/:id")
  async delete(req: Request, res: Response) {
    const id = +req.params.id;
    res.json(await tagModel.delete(id));
  }

  @Controller.Post("/toggle-topic/:tagId")
  async toggleTopicTag(req: Request, res: Response) {
    const tagId = +req.params.tagId;
    const { action, topicId } = req.body;
    switch (action) {
      case "set":
        res.json(await tagModel.setTopicTag(tagId, topicId));
        break;
      case "unset":
        res.json(await tagModel.unsetTopicTag(tagId, topicId));
    }
  }
}