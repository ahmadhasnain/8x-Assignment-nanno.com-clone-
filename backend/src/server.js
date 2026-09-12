import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import creatorRoutes from "./routes/creators.js";
import marketplaceRoutes from "./routes/marketplace.js";
import companyRoutes from "./routes/companies.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/creators", creatorRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/companies", companyRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
