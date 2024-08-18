import Controller from "$/server/core/Controller.js";
import categoryModel from "$/server/models/category.model.js";
import type { Request, Response } from "express";

@Controller.Prefix("/api/v1")
export default class CategoryController extends Controller {
  @Controller.Get("/categories")
  async getAll(_req: Request, res: Response) {
    res.json(await categoryModel.findAll());
  }

  @Controller.Get("/categories/:id")
  async getOneById(req: Request, res: Response) {
    res.json(await categoryModel.findOneById(+req.params.id));
  }

  @Controller.Post("/categories")
  async add(req: Request, res: Response) {
    const data = req.body;
    res.json(await categoryModel.add(data));
  }

  @Controller.Patch("/categories/:id")
  async update(req: Request, res: Response) {
    const data = req.body;
    res.json(await categoryModel.update(data));
  }

  @Controller.Delete("/categories/:id")
  async deleteOne(req: Request, res: Response) {
    const id = +req.params.id;
    res.json(await categoryModel.delete(id));
  }
}