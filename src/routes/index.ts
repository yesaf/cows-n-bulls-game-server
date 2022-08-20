import { Application } from "express";
import userRouter from "./api/user.route";
import roomRouter from "./api/room.route";
class AppRouter {
    constructor(private app: Application) {}
    init() {
        this.app.get("/", (_req, res) => {
            res.send("API Running");
        });
        this.app.use("/api/user", userRouter);
        this.app.use("/api/room", roomRouter);
    }
}

export default AppRouter;
