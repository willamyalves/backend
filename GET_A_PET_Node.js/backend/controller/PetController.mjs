import Pet from "../models/Pet.mjs";
import getToken from "../helpers/get-token.mjs";
import getUserByToken from "../helpers/get-user-by-token.mjs";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export default class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;

    let available = true;

    const images = req.files;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }
    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória" });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório" });
      return;
    }
    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória" });
      return;
    }
    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória" });
      return;
    }

    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.forEach((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(200).json({ message: "Pet cadastrado com sucesso", newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({ pets: pets });
  }
  static async getAllUserPets(req, res) {
    // Get user from token
    const token = await getToken(req);

    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }
  static async getAllUserAdoptions(req, res) {
    // Get user from token
    const token = await getToken(req);

    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }
  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "ID Inválido" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    try {
      res.status(200).json({ pet: pet });
    } catch (error) {
      console.log(error);
    }
  }
  static async removePet(req, res) {
    const id = await req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "ID Inválido" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    const token = await getToken(req);
    const user = await getUserByToken(token);

    if (user._id.toString() !== pet.user._id.toString()) {
      res
        .status(404)
        .json({ message: "Acesso negado. Pet não pertence a esta conta" });
      return;
    }

    try {
      await Pet.findByIdAndDelete(id);

      res.status(200).json({ message: "Pet deletado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  }
  static async updatePet(req, res) {
    const id = await req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "ID Inválido" });
      return;
    }

    const { name, age, weight, color, available } = req.body;

    const images = req.files;

    const updatedData = { available };

    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    if (user._id.toString() !== pet.user._id.toString()) {
      res
        .status(404)
        .json({ message: "Acesso negado. Pet não pertence a esta conta" });
      return;
    }

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    } else {
      updatedData.name = name;
    }
    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória" });
      return;
    } else {
      updatedData.age = age;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório" });
      return;
    } else {
      updatedData.weight = weight;
    }
    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória" });
      return;
    } else {
      updatedData.color = color;
    }
    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória" });
      return;
    } else {
      updatedData.images = [];

      images.forEach((image) => {
        updatedData.images.push(image.filename);
      });
    }

    try {
      await Pet.findByIdAndUpdate(id, updatedData);
      res.status(200).json({ message: "Pet atualizado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  }
  static async schedule(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "ID Inválido" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    const token = await getToken(req);
    const user = await getUserByToken(token);

    if (user._id.equals(pet.user._id)) {
      res.status(422).json({
        message:
          "Acesso negado. Você não pode agendar adoção do seu próprio pet",
      });
      return;
    }

    if (pet.adopter) {
      if (user._id.equals(pet.adopter._id)) {
        res.status(422).json({ message: "Você já solicitou adoção desse pet" });
        return;
      }
    }

    const adopter = {
      _id: user.id,
      name: user.name,
      image: user.image,
    };

    try {
      await Pet.findByIdAndUpdate(id, { adopter: adopter });
      res.status(200).json({
        message: `Agendamento de adoção realizado com sucesso. Agora você pode entrar em contato com ${pet.user.name} através do contato ${pet.user.phone}`,
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async concludeAdoption(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(404).json({ message: "ID Inválido" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    const token = await getToken(req);
    const user = await getUserByToken(token);

    if (!user._id.equals(pet.user._id)) {
      res.status(422).json({
        message: "Acesso negado.",
      });
      return;
    }
    try {
      await Pet.findByIdAndUpdate(id, { available: false });
      res.status(200).json({
        message: "Parabéns! Você concluiu o ciclo de adoção com sucesso",
      });
    } catch (error) {
      console.log(error);
    }
  }
}
