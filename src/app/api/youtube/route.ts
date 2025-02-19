import { NextResponse } from 'next/server';



export async function GET() {
	try {

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=Tnl4hQlI1Gc&key=AIzaSyAL3pVItelo_9D50Wbgrm1_HNLRCRgZ0fk`
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error?.message || 'YouTube API Error');
		}

		const data = await response.json();
		const video = data.items?.[0];

		if (!video) {
			return NextResponse.json(
				{ error: 'Video not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			statistics: video.statistics,
			title: video.snippet?.title,
			thumbnail: video.snippet?.thumbnails?.standard?.url
		});
	} catch (error: unknown) {
		console.error('YouTube API Error:', error);
		
		if (error instanceof Error && error.message?.includes('API key not valid')) {
			return NextResponse.json(
				{ error: 'Invalid YouTube API key' },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{ error: 'Failed to fetch video statistics' },
			{ status: 500 }
		);
	}
} 