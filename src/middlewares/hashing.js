import bcrypt from 'bcrypt';

export const hashPassword = async (req, res, next) => {
    const updatedData = req.body;

    if (updatedData.password !== undefined) {
        try {
            const saltRounds = 10; 
            updatedData.password = await bcrypt.hash(updatedData.password, saltRounds);
        } catch (error) {
            console.error("Hashing Error:", error);
            return res.status(500).json({ message: "Error interno al procesar la contraseña." });
        }
    }
    next();
};