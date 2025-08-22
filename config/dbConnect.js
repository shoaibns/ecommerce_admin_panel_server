const { PrismaClient } = require("@prisma/client");
// const registerMiddlewares = require("../middleware/prisma")

const prisma = new PrismaClient();

// registerMiddlewares(prisma);

module.exports = prisma;
