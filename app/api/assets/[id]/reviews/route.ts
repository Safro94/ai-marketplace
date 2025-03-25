import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const assetId = params.id

    const reviews = await prisma.review.findMany({
      where: {
        assetId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 },
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const assetId = params.id
    const { userId, rating, title, content } = await request.json()

    if (!userId || !rating || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        asset: { connect: { id: assetId } },
        user: { connect: { id: userId } },
        rating,
        title,
        content,
      },
    })

    // Update asset average rating and review count
    const assetReviews = await prisma.review.findMany({
      where: { assetId },
    })

    const totalRating = assetReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    )
    const averageRating = totalRating / assetReviews.length

    await prisma.asset.update({
      where: { id: assetId },
      data: {
        averageRating,
        reviewCount: assetReviews.length,
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    )
  }
}
