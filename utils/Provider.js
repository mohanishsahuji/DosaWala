import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "../models/User.js";
import express from 'express';


const app=express();
export const connectPassport = () => {

  

  const CclientID=process.env.CLIENT_ID
  const CclientSecret=process.env.SECRET
  const CcallbackURL=process.env.CALLBACK_URL

  const a = typeof CclientID
  const b = typeof CclientSecret
  const c = typeof CcallbackURL
  
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

const CclientID=process.env.CLIENT_ID
const CclientSecret=process.env.SECRET
const CcallbackURL=process.env.CALLBACK_URL

const a = typeof CclientID
const b = typeof CclientSecret
const c = typeof CcallbackURL

app.use("/provider",(req,res)=>{
  res.send(`<h1> ${a,b,c} ${CclientID,CclientSecret,CcallbackURL}</h1>`)
})
