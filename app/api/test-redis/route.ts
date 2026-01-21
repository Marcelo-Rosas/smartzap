import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const POST = async () => {
    try {
        // Verify env vars
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;
        console.log('[Redis Test] URL exists:', !!url, 'Token exists:', !!token);

        if (!url || !token) {
            throw new Error('Missing Upstash credentials in env');
        }

        // Initialize Redis after env validation
        const redis = Redis.fromEnv();

        // Set a test item first to ensure there is something to get
        await redis.set("item", "Hello from Upstash Redis!");

        // Fetch data from Redis
        const result = await redis.get("item");

        // Return the result in the response
        return new NextResponse(JSON.stringify({ result }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: String(error) }), { status: 500 });
    }
};
