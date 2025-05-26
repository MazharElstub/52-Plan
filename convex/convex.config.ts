import { defineApp } from "convex/server";
import { DataModel } from "./_generated/dataModel";

const app = defineApp<DataModel>();

export default app;