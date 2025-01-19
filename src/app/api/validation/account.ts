import { z } from "zod";

const accountValidationSchema = z.object({
  userId: z.number(),
  name: z.string(),
  type: z.string(),
  balance: z.number(),
  accountnumber:z.string()
});

export default accountValidationSchema;
