import "dotenv/config"

export const ENV = {

PORT:process.env.PORT,
MONGO_URL:process.env.MONGO_URL,
JWT_USER_SECRET:process.env.JWT_USER_SECRET,
NODE_ENV:process.env.NODE_ENV,
OPENAI_API_KEY:process.env.OPENAI_API_KEY

}