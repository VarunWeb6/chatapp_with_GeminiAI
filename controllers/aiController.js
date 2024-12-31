import * as aiService from '../service/aiService.js';

export const getResult = async (req, res) => {
    const { prompt } = req.query;
    try {
        const result = await aiService.generateResult(prompt);
        res.status(200).json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}