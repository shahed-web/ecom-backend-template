import _ from 'lodash';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {prisma} from "../lib/prisma";
import { issueToken, type UserDataPayload } from '../helper/auth.helper';
import { envConfig } from '../config/env.config';

passport.use(new GoogleStrategy({
    clientID: envConfig.OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: envConfig.OAUTH.GOOGLE.CLIENT_SECRET,
    callbackURL: envConfig.OAUTH.GOOGLE.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log("Google profile:", profile);
            const email : string = profile.emails?.[0]?.value || ""
            let user = await prisma.user.findUnique({
                    where: {
                        email: email 
                    }
                })

            if(!user) {
                user = await prisma.user.create({
                    data: {
                        email: email,
                        googleId: profile.id,
                    }
                })
            } 

            if(!user.googleId) {
                user = await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        googleId: profile.id
                    }
                })
            }   

            const tokens = await issueToken(_.pick(user, ['id', 'email', 'role']) as UserDataPayload)
            done(null, tokens)
        } catch (error) {
            done(error as Error, undefined);
        }
    }
))