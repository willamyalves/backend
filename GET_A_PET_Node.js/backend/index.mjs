import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.mjs";
import PetsRoutes from "./routes/PetsRoutes.mjs";

const app = express();

// Resolve JSON
app.use(express.json());

// Resolve cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Public
app.use(express.static("public"));

// Routes
app.use("/users", UserRoutes);
app.use("/pets", PetsRoutes);

app.listen(5000, () => {
  console.log("Funcionando");
});
