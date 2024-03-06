import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    req: NextRequest,
    { params }: {
        params:
        { apiKey: string }
    }) {
    
    return NextResponse.json(params.apiKey);

    // if (!params.apiKey) {
    //     return NextResponse.json({
    //         error: "Must have a valid api key!"
    //     })
    // }

    // const user = await prisma.user.findFirst({
    //     where: {
    //         apiKey: String(params.apiKey)
    //     }
    // })

    // if (!user) {
    //     return NextResponse.json({
    //         error: "There is no user with such api key!"
    //     })
    // }

    // const customer = await stripe.customers.retrieve(String(user?.stripeCustomerId));

    // const subscriptions = await stripe.subscriptions.list({
    //     customer: String(user?.stripeCustomerId)
    // })

    // const item = subscriptions.data.at(0)?.items.data.at(0);

    // if (!item) {
    //     NextResponse.json({
    //         error: "You have no subscription."
    //     })
    // }

    // await stripe.subscriptionItems.createUsageRecord(String(item?.id),
    //     {
    //         quantity: 1
    //     })


    // const data = uuidv4();

    // const log = await prisma.log.create({
    //     data: {
    //         userId: String(user?.id),
    //         status: 200,
    //         method: "GET",
    //     }
    // })

    // NextResponse.json({
    //     status: true,
    //     special_key: data,
    //     log: log
    // })
}