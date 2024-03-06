import { authConfig } from './auth';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import prisma from './prismadb';
import PriceingPlan from '@/components/sections/price/PriceingPlan';
import { stripVTControlCharacters } from 'util';

//price_1NarR3APMZcBliJSoefCKTi5

export const priceIds = [
    {
        type: 'starter',
        priceId: 'price_1Oodo2KG11P8tDTOPtuuPaoZ'
    },
    {
        type: 'creator',
        priceId: 'price_1OodoSKG11P8tDTO9FHQDyfp',
    },
]

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
    //@ts-ignore
    apiVersion: '2022-11-15',
});

export async function hasSubscription() {
    const session = await getServerSession(authConfig);

    if (session) {
        //@ts-ignore
        const user = await prisma.User.findFirst({ where: { email: session.user?.email?.toString() } });

        const subscriptions = await stripe.subscriptions.list({
            customer: String(user?.stripeCustomerId)
        })

        console.log(subscriptions)

        return subscriptions.data.length > 0;
    }

    return false;
}

export async function createCheckoutLink(customer: string, priceId: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: "http://localhost:3000/dashboard/billing?success=true",
        cancel_url: "http://localhost:3000/dashboard/billing?success=true",
        customer: customer,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ],
        mode: "subscription"
    })

    return checkout.url;
}

export async function createCustomerIfNull() {
    const session = await getServerSession(authConfig);
    console.log(session)

    if (session) {
        const user = await prisma.user.findFirst({ where: { email: session.user?.email as string} });
        console.log(user);

        if (!user?.apiKey) {
            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    apiKey: "apiKey_" + uuidv4()
                }
            })
        }
        if (!user?.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: String(user?.email)
            })

            await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    stripeCustomerId: customer.id,
                    apiKey: 'apiKey_' + uuidv4(),
                }
            })
        }
        const user2 = await prisma.user.findFirst({ where: { email: session.user?.email as string} });
        console.log(user2)
        return user2?.stripeCustomerId;
    }

}