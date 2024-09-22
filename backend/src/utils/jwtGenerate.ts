import jwt from "jsonwebtoken";

export const createAuthToken = (userId: string) => {
  const token = jwt.sign(
    { id: userId, scope: "auth" },
    process.env.JWTSECRET!,
    { expiresIn: "1d" }
  );
  return token;
};

export const createResetToken = (userId: string) => {
  const token = jwt.sign(
    { id: userId, scope: "reset" },
    process.env.JWTSECRET!,
    { expiresIn: "1h" }
  );
  return token;
};

export const validateToken = (token: string, expectedScope: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET!) as jwt.JwtPayload;

    if (decoded.scope !== expectedScope) {
      throw new Error("Invalid token scope");
    }
    return decoded;
  } catch (error) {
   
    throw new Error("Invalid or expired token");
  }
};
