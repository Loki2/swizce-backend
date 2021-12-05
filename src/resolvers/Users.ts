import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { CurrentModel } from "../entities/Current";
import { HometownModel } from "../entities/Hometown";
import { Profile, ProfileModel } from "../entities/Profile";
import { User, UserModel } from "../entities/User";
import { AppContext } from "../types";
import { isAuthenticated } from "../utils/authHandler";


@Resolver()
export class UserResolvers {
  @Query(() => Profile, {nullable: true})
  async myprofile(@Ctx() { req }: AppContext): Promise<Profile | null>{
    try {
      //Check if User authenticated
      const user = await isAuthenticated(req);

      if (!user) throw new Error("Not authenticated...! ");

      const id = user._id;

      const myinfo = await UserModel.findById({ _id: id })
        .populate({
          path: "profile",
          model: ProfileModel,
          populate: [
            { path: "current", model: CurrentModel },
            { path: "hometown", model: HometownModel }
          ],
        }); //;      
      return myinfo.profile;
    } catch (error) {
      throw error;
    }
  }

  //upload user profile images
  @Mutation(() => User, { nullable: true })
  async updateUserImage(
    @Arg("image") image: string,
    @Ctx() { req }: AppContext
  ): Promise<User | null>{
    try {
      const isUser = await isAuthenticated(req);

      if(!isUser) throw new Error("Not authenticated...! ");

      const id = isUser._id;

      const user = await UserModel.findById({ _id: id })

      if(!user.images){
        user.images = image
      }else{
        user.images.push(image)
      }

      await user.save()
      // console.log("my image imfo:", myImage)

      return user
    } catch (error) {
      throw error;
    }
  }


  //uploading user cover images
  @Mutation(() => User, { nullable: true })
  async updateUserCover(
    @Arg("cover") cover: string,
    @Ctx() { req }: AppContext
  ): Promise<User | null>{
    try {
      const isUser = await isAuthenticated(req);

      if(!isUser) throw new Error("Not authenticated...! ");

      const id = isUser._id;

      const user = await UserModel.findById({ _id: id })

      if(!user.covers){
        user.covers = cover
      }else{
        user.covers.push(cover)
      }

      await user.save()
      // console.log("my image imfo:", myImage)

      return user
    } catch (error) {
      throw error;
    }
  }
}