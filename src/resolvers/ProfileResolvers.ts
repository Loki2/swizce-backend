import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { CurrentModel } from "../entities/Current";
import { HometownModel } from "../entities/Hometown";
import { Profile, ProfileModel } from "../entities/Profile";
import { UserModel } from "../entities/User";
import { AppContext, RoleOptions } from "../types";
import { isAuthenticated } from "../utils/authHandler";

@Resolver()
export class ProfileResolver {
  @Query(() => [Profile], { nullable: "items" })
  async profiles(@Ctx() { req }: AppContext) {
    try {
      const userId = await isAuthenticated(req);

      if (!userId) throw new Error("Please Login to Process...!");

      //Check If User Authorization(Admin Or SuperAdmin)
      const isAuthorized = userId.roles.includes(RoleOptions.superAdmin);

      if (!isAuthorized) throw new Error("No Authorization...");

      return ProfileModel.find()
        .populate({ path: "current", model: CurrentModel })
        .populate({ path: "hometown", model: HometownModel });
    } catch (error) {
      throw error;
    }
  }

  //Create User profile
  @Mutation(() => Profile)
  async createProfile(
    @Ctx() {req} : AppContext,
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string,
    @Arg("bios") bios: string,
    @Arg("gender") gender: string,
    @Arg("age") age: number,
    @Arg("birthdate") birthdate: Date,
    @Arg("mentalStatus") mentalStatus: string,
    @Arg("profileUrl") profileUrl: string,
    @Arg("coverUrl") coverUrl: string
  ): Promise<Profile | null>{
    try {
      const userId = await isAuthenticated(req);

      if (!userId) throw new Error("Please Login to Process...!");

      const profile = await ProfileModel.create({
        firstname,
        lastname,
        bios,
        gender,
        age,
        birthdate,
        mentalStatus,
        profileUrl,
        coverUrl,
        user: userId
      })

      const user = await UserModel.findById(userId);

      if(!user.profile){
        user.profile = profile;
      }else{
        user.profile.push(profile)
      }

      await user.save()

      return ProfileModel.findById(profile.id);
    } catch (error) {
      throw error;
    }
  }

  //Query user Profile by ID:
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
        })
        .sort({ createAt: "desc" }); //;

      console.log(myinfo)
      
      return myinfo.profile;
    } catch (error) {
      throw error;
    }
  }
}
