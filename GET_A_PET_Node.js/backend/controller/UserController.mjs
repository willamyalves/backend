import User from "../models/User.mjs";
import bcrypt from "bcrypt";
import createUserToken from "../helpers/create-user-token.mjs";
import getToken from "../helpers/get-token.mjs";
import jwt from "jsonwebtoken";
import getUserByToken from "../helpers/get-user-by-token.mjs";

export default class UserController {
  static async register(req, res) {
    const { name, email, password, confirmpassword, phone, image } = req.body;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({ message: "A confirmação de senha é obrigatória" });
      return;
    }
    if (!phone) {
      res.status(422).json({ message: "O número de telefone é obrigatório" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não são iguais" });
      return;
    }

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      res.status(422).json({ message: "E-mail já cadastrado" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    if (!user) {
      res.status(422).json({ message: "Este e-mail não está cadastrado" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: "A senha está incorreta" });
      return;
    }

    try {
      await createUserToken(user, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro" });
    }
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = await getToken(req);

      const decoded = jwt.verify(token, "nossosecret");

      currentUser = await User.findById(decoded.id);
      currentUser.password = null;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(400).json({ message: "Id não encontrado" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const token = await getToken(req);
    const user = await getUserByToken(token);

    const { name, email, password, phone, confirmpassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    // Validações
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }
    if (email === user.email) {
      res.status(422).json({ message: "O e-mail deve ser diferente do atual" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists && email !== user.email) {
      res.status(422).json({ message: "Este e-mail já está em uso" });
      return;
    }

    if (!phone) {
      res.status(422).json({ message: "O número de telefone é obrigatório" });
      return;
    }
    if (password && password !== confirmpassword) {
      res.status(422).json({ message: "As senhas não são iguais" });
      return;
    }

    // Atualizar senha se fornecida
    if (password) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    // Atualizar informações do usuário
    user.name = name;
    user.email = email;
    user.phone = phone;

    try {
      await User.findByIdAndUpdate(user._id, { $set: user }, { new: true });
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
