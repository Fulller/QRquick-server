import JWTService from "../services/jwt.service";

export async function ensureAuthenticated(req, res, next) {
  try {
    const accessToken: string = req.headers["accesstoken"]?.toString() || "";
    await JWTService.access.verify(accessToken);
    return next();
  } catch {
    res.fly({ status: 403 });
  }
}
export async function profileAuthenticated(req, res, next) {
  let profile: any = null;
  try {
    const accessToken: string = req.headers["accesstoken"]?.toString() || "";
    profile = await JWTService.access.verify(accessToken);
    req.profile = profile;
  } catch {
    req.profile = null;
  }
  next();
}
