import {
    createCheckoutLink,
    createCustomerIfNull,
    hasSubscription,
    stripe,
  } from "@/lib/stripe";
  import Link from "next/link";
  
  import { PrismaClient } from "@prisma/client";
  import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import prisma from "@/lib/prismadb";
import { getUserFromDB } from "../../actions/actions";
import Header from "@/components/layout/Header";
import ProductSideBar from "@/components/layout/ProductSideBar";
import Case from "@/components/sections/product/subscription";
  
  export default async function Page() {
    const session = await getServerSession(authConfig);
    const customer = await createCustomerIfNull();
    const hasSub = await hasSubscription();
    //const checkoutLink = await createCheckoutLink(String(customer));
  
    const user = await getUserFromDB();
  
    const top10Recentlogs = await prisma.log.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        created: "desc",
      },
      take: 10,
    });
  
    let current_usage = 0;
  
    if (hasSub) {
      const subscriptions = await stripe.subscriptions.list({
        customer: String(user?.stripeCustomerId),
      });
      const invoice = await stripe.invoices.retrieveUpcoming({
        subscription: subscriptions.data.at(0)?.id,
      });
  
      current_usage = invoice.amount_due;
    }
  
    return (
      <main className="flex flex-row">
      <ProductSideBar productName="Subscription" />
      <Case />
    </main>
    );
  }