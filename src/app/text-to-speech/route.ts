import { NextResponse } from "next/server";
import { exec } from 'child_process';

export async function POST(request: Request) {
    const { text } = await request.json();
    const translatedTextPromise = new Promise((resolve, reject) => {
        exec(
            `pwd && ls && cd ___vc && ls`,
            (error, stdout, stderr) => {
            if (error) {
                console.error(error);
                reject(error);
            }
            resolve(stdout)
        });
    })
    const src = await translatedTextPromise;
    console.log(src)
     return NextResponse.json({ src });
}