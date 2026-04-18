import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "VENDOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, image, category, stock } = body;

  if (!name || !description || !price || !image || !category) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      image,
      category,
      stock: parseInt(stock),
    },
  });

  return NextResponse.json(product);
}
