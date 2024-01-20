import { addUser, getUser } from "../services/user.service.js";
import { hashPassword } from "../utils/hash.utils.js";

const payload = {
  name: "BlogSite",
  address: "Test address",
  email: "superadmin@gmail.com",
  password: "Hello@123",
  user_type: "admin",
  contact: "987898767",
};

export default async function addSuperAdmin() {
  const response = await getUser({
    email: payload.email,
    user_type: payload.user_type,
  });
  if (response) {
    console.log("Superadmin already exist.");
  } else {
    //hash password here and pass
    const hash_password = await hashPassword(payload.password);
    const user = await addUser({ ...payload, password: hash_password });
    console.log("Superadmin added successfully.");
    console.log(user);
  }
}
