const User = require("../Models/User");

const seedAdmin = async () => {
  const user = await User.find({ where: { email: "yahya.ensas@hotmail.com" } });


  if (!user) {
    await User.create({
      nom: "eloukili",
      prenom: "yahya",
      email: "yahya.ensas@hotmail.com",
      matricule: "admin1234",
      password: 'admin1234',
      role: "admin"
    });
  }
};
module.exports = seedAdmin;
