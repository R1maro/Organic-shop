import type { NextApiRequest, NextApiResponse } from 'next';
import config from "@/config/config";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: 'Name is required' });
        }

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const response = await fetch(
            `${config.API_URL}/admin/setting-groups`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: name.trim() })
            }
        );

        const data = await response.json();


        return res.status(response.ok ? 201 : response.status).json(data);
    } catch (error) {
        console.error('Error creating setting group:', error);

        return res.status(500).json({ message: 'Internal server error' });
    }
}