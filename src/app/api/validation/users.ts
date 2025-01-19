import { z } from "zod";

const userValidationSchema = z.object({
  name: z.string().min(2),
  lname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(3),
});

export default userValidationSchema;
