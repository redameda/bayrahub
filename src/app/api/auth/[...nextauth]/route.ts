import ConnectDb from "@/lib/db";
import User from "@/models/User";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRETE as string
        })
    ],
    callbacks: {

        async signIn({ user }) {
            try {
                await ConnectDb()
                const isExist = await User.findOne({ email: user.email });
                if (!isExist) {
                    const account = await User.create({
                        email: user.email,
                        name: user.name,
                        profile: user.image
                    })
                    return true
                } else {
                    return true

                }

                return true
            } catch (error) {
                console.error(error);

                return false
            }

        }

    }
})
export { handler as GET, handler as POST }