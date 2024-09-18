import Pet from "../models/Pet.mjs";
import getToken from "../helpers/get-token.mjs";
import getUserByToken from "../helpers/get-user-by-token.mjs";

export default class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;

    let available = true;

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

    const token = await getToken(req);
    const user = await getUserByToken(token);

    console.log(user);
    

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

    try {
      const newPet = await pet.save();
      res.status(200).json({ message: "Pet cadastrado com sucesso", newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
