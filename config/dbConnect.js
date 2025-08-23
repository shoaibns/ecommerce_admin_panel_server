import { PrismaClient } from "@prisma/client";
// const registerMiddlewares = require("../middleware/prisma")

const prisma = new PrismaClient();

// registerMiddlewares(prisma);

export default prisma;
