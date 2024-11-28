import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { Response, Request, NextFunction } from "express";
import { z } from "zod";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ ping: "pong" });
});

const signupSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

const signinSchema = signupSchema.omit({ name: true });

function inputValidSignup(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  const check = signupSchema.safeParse(body);
  if (!check.success) res.status(500).json({ message: "Wrong input" });
  next();
}

function inputValidSignin(req: Request, res: Response, next: NextFunction) {
  const body = req.body;
  const check = signinSchema.safeParse(body);
  if (!check.success) res.status(500).json({ message: "Wrong input" });
  next();
}

app.post("/signup", inputValidSignup, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      res.status(500).json({ message: "User already exist" });
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    const token = sign({ id: newUser.id }, process.env.JWT_SECRET || "");
    res.status(200).json({
      message: "User signed up successfully",
      token: `Bearer ${token}`,
    });
  } catch {
    res.status(500).json({ message: "try catch error" });
  }
});

app.post("/signin", inputValidSignin, async (req, res) => {
  try {
    const body = req.body;
    const { email, password } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(500).json({ message: "User doesn't exist" });
    } else {
      const check = await compare(password, user?.password);
      if (!check) {
        res.status(403).json({ message: "Wrong password" });
      }
      const token = sign({ id: user.id }, process.env.JWT_SECRET || "");
      res.status(200).json({
        message: "User signed in successfully",
        token: `Bearer ${token}`,
      });
    }
  } catch {
    res.status(500).json({ message: "try catch error" });
  }
});

app.listen(8000, () => {
  console.log(`Server running on port ${8000}`);
});
