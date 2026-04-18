import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    return new NextResponse("Product not found", { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "VENDOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, image, category, stock } = body;

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      price: price ? parseFloat(price) : undefined,
      image,
      category,
      stock: stock ? parseInt(stock) : undefined,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "VENDOR") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  return new NextResponse(null, { status: 204 });
}
