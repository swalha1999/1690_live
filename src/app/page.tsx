'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface VideoStats {
	statistics: {
		viewCount: string;
		likeCount: string;
		commentCount: string;
	};
	title: string;
	thumbnail: string;
}

interface StatDisplayProps {
	value: string;
	label: string;
	color: string;
	previousValue?: string;
}

const StatDisplay = ({ value, label, color, previousValue }: StatDisplayProps) => {
	const hasIncreased = previousValue && parseInt(value) > parseInt(previousValue);
	const hasDecreased = previousValue && parseInt(value) < parseInt(previousValue);
	
	return (
		<motion.div
			className={`text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors`}
			whileHover={{ scale: 1.05 }}
			layout
		>
			<div className="relative">
				<motion.div
					key={value}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className={`text-3xl font-bold ${color}`}
				>
					{value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					{hasIncreased && (
						<motion.span
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute -right-4 text-green-500 text-sm"
						>
							↑
						</motion.span>
					)}
					{hasDecreased && (
						<motion.span
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="absolute -right-4 text-red-500 text-sm"
						>
							↓
						</motion.span>
					)}
				</motion.div>
			</div>
			<motion.div className="text-gray-600 font-medium">{label}</motion.div>
		</motion.div>
	);
};

export default function Home() {
	const [stats, setStats] = useState<VideoStats | null>(null);
	const [previousStats, setPreviousStats] = useState<VideoStats | null>(null);
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [updating, setUpdating] = useState(false);
	const updateCounterRef = useRef(0);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setUpdating(true);
				const response = await fetch('/api/youtube');
				if (!response.ok) {
					throw new Error('Failed to fetch video statistics');
				}
				const data = await response.json();
				setPreviousStats(stats);
				setStats(data);
				updateCounterRef.current += 1;
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setUpdating(false);
				setLoading(false);
			}
		};

		fetchStats();
		const interval = setInterval(fetchStats, 10000); // Update every 10 seconds
		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<motion.div
					animate={{
						rotate: 360,
						transition: { duration: 1, repeat: Infinity, ease: "linear" }
					}}
					className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"
				/>
			</div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="min-h-screen flex items-center justify-center bg-gray-100"
			>
				<div className="text-red-500 bg-white p-4 rounded-lg shadow">{error}</div>
			</motion.div>
		);
	}

	return (
		<main className="min-h-screen p-8 bg-gray-100">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
			>
				<motion.h1
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-3xl font-bold text-center p-6 text-gray-800"
				>
					FRC team 1690 Orbit 2025 robot reveal - "WHISPER"
				</motion.h1>
				{stats?.thumbnail && (
					<div className="relative pt-[56.25%]">
						<motion.img
							layoutId="thumbnail"
							src={stats.thumbnail}
							alt={stats.title}
							className="absolute top-0 left-0 w-full h-full object-cover"
						/>
					</div>
				)}
				<motion.div
					className="p-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<motion.div
						className="flex items-center justify-between mb-4"
					>
						<motion.h1
							layoutId="title"
							className="text-2xl font-bold text-gray-800"
						>
							{stats?.title}
						</motion.h1>
						{updating && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="text-sm text-gray-500"
							>
								Updating...
							</motion.div>
						)}
					</motion.div>
					
					<motion.div
						className="grid grid-cols-3 gap-4"
						layout
					>
						<StatDisplay
							value={stats?.statistics.viewCount || '0'}
							previousValue={previousStats?.statistics.viewCount}
							label="Views"
							color="text-blue-600"
						/>
						<StatDisplay
							value={stats?.statistics.likeCount || '0'}
							previousValue={previousStats?.statistics.likeCount}
							label="Likes"
							color="text-green-600"
						/>
						<StatDisplay
							value={stats?.statistics.commentCount || '0'}
							previousValue={previousStats?.statistics.commentCount}
							label="Comments"
							color="text-purple-600"
						/>
					</motion.div>
				</motion.div>
			</motion.div>
		</main>
	);
} 