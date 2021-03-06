import { UserModel } from "../entities/User";
import { AppRequest } from "../types";



export const isAuthenticated = async (req: AppRequest) => {
   //Check if req has no UserId
   if (!req.userId) throw new Error("Please Login to proceed...!");
  
  //Query User from database
  const user = await UserModel.findById(req.userId);
  if (!user) throw new Error("Not authenticated...!");

  //check if token version is valid
  if(req.tokenVersion !== user.tokenVersion) throw new Error('Not authenticated...!')

  return user
}