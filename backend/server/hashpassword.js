import bcrypt from "bcryptjs";

async function hashPassword() {
  const password = "newpassword123";
  const hash = await bcrypt.hash(password, 12);
  console.log(hash);
}

hashPassword();
