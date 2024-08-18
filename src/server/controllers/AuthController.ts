import Controller from "$/server/core/Controller.js";
import userModel from "$/server/models/user.model.js";
import authService from "$/server/services/auth.service.js";
import emailService from "$/server/services/email.service.js";
import type { Request, Response } from "express";

@Controller.Prefix("/api/v1/auth")
export default class AuthController extends Controller {
  private get _authCookieKey() {
    return "auth_token";
  }

  @Controller.Get("/check-log-in")
  async checkLogIn(req: Request, res: Response) {
    const email = authService.decodeAuthToken(req.signedCookies[this._authCookieKey] ?? "");
    res.json(
      email
        ? [email, null]
        : [null, { errors: [] }]
    );
  }

  @Controller.Post("/log-in")
  async logIn(req: Request, res: Response) {
    const [user, error] = await userModel.findOneByCredentials({
      email: req.body.email,
      password: req.body.password
    });

    if (error) {
      res.json([null, error]);
      return;
    }

    res.cookie(this._authCookieKey, authService.createAuthToken(user.email), {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      signed: true
    });
    res.json([null, null]);
  }

  @Controller.Get("/users")
  async allUsers(_req: Request, res: Response) {
    res.json(await userModel.findAll());
  }

  @Controller.Post("/user")
  async createUser(req: Request, res: Response) {
    const { email, password } = req.body;
    res.json(await userModel.add({ email, password }));
  }

  @Controller.Patch("/reset-password/:id/:passwordResetId")
  async updatePassword(req: Request, res: Response) {
    const id = +req.params.id;
    const passwordResetId = +req.params.passwordResetId;
    res.json(await userModel.updatePassword(id, passwordResetId, req.body.password));
  }

  @Controller.Post("/password-reset-request")
  async handlePasswordResetRequest(req: Request, res: Response) {
    const { email } = req.body;
    const [user, error] = await userModel.findOneByEmail(email);

    if (error) {
      res.json([null, error]);
      return;
    }

    const [passwordResetId, error2] = await userModel.setPasswordResetId(user.id);

    if (error2) {
      res.json([null, error2]);
      return;
    }

    const resetLink = `${process.env.HOST}/reset-password/${user.id}/${passwordResetId}`;
    await emailService.sendEmail({
      to: user.email,
      subject: "Resetting your password",
      content: "<p>Hello,</p>"
        + "<p><div>Please follow the link below to reset your password.</div>"
        + `<div>${resetLink}</div></p>`
        + "<p><div>Best regards,</div>"
        + "<div>The Mandarin Voc App admin</div></p>"
    });
    res.json([null, null]);
  }
}

// TODO: password reset