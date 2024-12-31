   import dotenv from "dotenv";
   dotenv.config();
   import http from "http";
   import app from "./app.js";
   import { Server } from "socket.io";
   import jwt from "jsonwebtoken";
   import mongoose from "mongoose";
   import projectModel from "./models/projectModel.js";
   import { generateResult } from "./service/aiService.js";

   const port = process.env.PORT;

   const server = http.createServer(app);
   const io = new Server(server, {
   cors: {
      origin: "*",
   },
   });

   io.use(async (socket, next) => {
   try {
      const token =
         socket.handshake.auth?.token ||
         socket.handshake.headers.authorization?.split(" ")[1];
      const projectId = socket.handshake.query.projectId;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
         return next(new Error("Invalid projectId"));
      }

      socket.project = await projectModel.findById(projectId);

      if (!socket.project) {
         return next(new Error("Project not found"));
      }

      if (!token) {
         return next(new Error("Unauthorized access to socket"));
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the socket
      if (!decoded) {
         return next(new Error("Unauthorized access to socket"));
      }

      socket.user = decoded;

      next();
   } catch (error) {
      next(error);
   }
   });

   io.on("connection", (socket) => {
   if (socket.project && socket.project._id) {
      socket.roomId = socket.project._id.toString();
      console.log("User connected to project:", socket.project._id);

      socket.join(socket.roomId);

      socket.on("project-message", async (data) => {
         console.log("Received message:", data);

         const message = data.message;

         const aiIsPresentInMessage = message.includes("@ai");

         if (aiIsPresentInMessage) {


            const prompt = message.replace('@ai', '');

            const result = await generateResult(prompt);


            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })


            return
        }
         socket.broadcast.to(socket.roomId).emit("project-message", data);
      });

      socket.on("disconnect", () => {
         console.log("User disconnected from project:", socket.roomId);
         socket.leave(socket.roomId);
      });
   } else {
      console.error("No project found for the socket connection");
   }
   });

   server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
   });
