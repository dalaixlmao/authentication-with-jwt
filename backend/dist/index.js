"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.status(200).json({ ping: "pong" });
});
const signupSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
const signinSchema = signupSchema.omit({ name: true });
function inputValidSignup(req, res, next) {
    const body = req.body;
    const check = signupSchema.safeParse(body);
    if (!check.success)
        res.status(500).json({ message: "Wrong input" });
    next();
}
function inputValidSignin(req, res, next) {
    const body = req.body;
    const check = signinSchema.safeParse(body);
    if (!check.success)
        res.status(500).json({ message: "Wrong input" });
    next();
}
app.post("/signup", inputValidSignup, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { name, email, password } = body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user) {
            res.status(500).json({ message: "User already exist" });
        }
        const hashedPassword = yield (0, bcrypt_1.hash)(password, 10);
        const newUser = yield prisma.user.create({
            data: { email, name, password: hashedPassword },
        });
        const token = (0, jsonwebtoken_1.sign)({ id: newUser.id }, process.env.JWT_SECRET || "");
        res.status(200).json({
            message: "User signed up successfully",
            token: `Bearer ${token}`,
        });
    }
    catch (_a) {
        res.status(500).json({ message: "try catch error" });
    }
}));
app.post("/signin", inputValidSignin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { email, password } = body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(500).json({ message: "User doesn't exist" });
        }
        else {
            const check = yield (0, bcrypt_1.compare)(password, user === null || user === void 0 ? void 0 : user.password);
            if (!check) {
                res.status(403).json({ message: "Wrong password" });
            }
            const token = (0, jsonwebtoken_1.sign)({ id: user.id }, process.env.JWT_SECRET || "");
            res.status(200).json({
                message: "User signed up successfully",
                token: `Bearer ${token}`,
            });
        }
    }
    catch (_a) {
        res.status(500).json({ message: "try catch error" });
    }
}));
app.listen(8000, () => {
    console.log(`Server running on port ${8000}`);
});
