import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/User.js";
import express from 'express';


const app=express();
export const connectPassport = () => {

  

export const CclientID=process.env.CLIENT_ID
export const CclientSecret=process.env.SECRET
export const CcallbackURL=process.env.CALLBACK_URL

  
  passport.use(
    new GoogleStrategy(
      {
        clientID: CclientID ,
        clientSecret: CclientSecret,
        callbackURL: CcallbackURL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // Use await to execute the query and get the user
          const user = await User.findOne({
            googleId: profile.id,
          });

          if (!user) {
            // If the user doesn't exist, create a new user
            const newUser = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              photo: profile.photos[0].value,
            });
            return done(null, newUser);
          } else {
            // If the user exists, return the user
            return done(null, user);
          }
        } catch (error) {
          // Handle any errors that occur during the process
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Use await to execute the query and get the user
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      // Handle any errors that occur during the process
      done(error, null);
    }
  });
};

