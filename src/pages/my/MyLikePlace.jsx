// src/pages/my/MyLikePlace.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '../../atoms';
import { url } from '../../config/config';

const tabs = [
    { label: '모임', path: '/myLikeClass' },
    { label: '장소', path: '/myLikePlace' },
    { label: '글쓰기', path: '/myLikeWrite' },
    { label: '책', path: '/myLikeBook' },
];

export default function MyLikePlace() {
    const location = useLocation();
    const token = useAtomValue(tokenAtom);
    const [places, setPlaces] = useState([]);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        if (!token?.access_token) return;
        axios
            .get(`${url}/my/likePlace`, {
                headers: { Authorization: `Bearer ${token.access_token}` },
            })
            .then(res => {
                console.log('받아온 장소 목록:', res.data);
                const list = Array.isArray(res.data) ? res.data : res.data.places || [];
                const mapped = list.map(p => ({
                    id: p.placeId,
                    name: p.name,
                    address: p.location,
                    categories: [p.tag1, p.tag2, p.tag3].filter(t => t && t.trim()),
                    image: p.img1 || '',
                    likeCount: p.likeCount ?? 0,
                    liked: p.liked ?? false,
                }));
                setPlaces(mapped);
            })
            .catch(err => {
                console.error('좋아요 장소 조회 실패:', err);
                setPlaces([]);
            });
    }, [token]);

    const toggleLike = (placeId) => {
        if (!token?.access_token) return;
        axios
            .post(
                `${url}/my/place-like`,
                {},
                {
                    headers: { Authorization: `Bearer ${token.access_token}` },
                    params: { placeId },
                }
            )
            .then(res => {
                console.log('토글 결과:', res.data);
                const { likeCount, liked } = res.data;
                setPlaces(prev =>
                    prev.map(p =>
                        p.id === placeId ? { ...p, likeCount, liked } : p
                    )
                );
            })
            .catch(err => console.error('좋아요 토글 실패:', err));
    };

    const safe = Array.isArray(places) ? places : [];
    const visible = showAll ? safe : safe.slice(0, 4);

    return (
        <div className="px-4 py-6 max-w-screen-xl mx-auto">
            <h2 className="text-xl font-bold mb-6">좋아요</h2>

            {/* Tabs */}
            <div className="flex space-x-6 border-b mb-8">
                {tabs.map(tab => (
                    <Link
                        key={tab.label}
                        to={tab.path}
                        className={`pb-2 transition-all ${location.pathname === tab.path
                                ? 'text-black border-b-2 border-blue-500 font-semibold'
                                : 'text-gray-500 hover:text-blue-600'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            {/* 좋아요 장소 없을 때 */}
            {safe.length === 0 && (
                <div className="text-center py-20">
                    <p className="mb-4 text-gray-600">아직 좋아요한 장소가 없습니다.</p>
                    <Link
                        to="/place"
                        className="inline-block px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        장소 보러가기
                    </Link>
                </div>
            )}

            {/* 장소 리스트 */}
            {safe.length > 0 && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {visible.map(place => (
                            <div
                                key={place.id}
                                className="bg-white border rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow relative"
                            >
                                {/* 좋아요 토글 */}
                                <button
                                    onClick={() => toggleLike(place.id)}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                                >
                                    {place.liked ? (
                                        <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                        6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                        3.57 2.36h1.87C13.46 5.99 14.96 
                        5 16.5 5 18.5 5 20 6.5 20 
                        8.5c0 3.78-3.4 6.86-8.55 
                        11.54L12 21.35z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                        6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                        3.57 2.36h1.87C13.46 5.99 14.96 
                        5 16.5 5 18.5 5 20 6.5 20 
                        8.5c0 3.78-3.4 6.86-8.55 
                        11.54L12 21.35z" />
                                        </svg>
                                    )}
                                </button>

                                {/* 클릭 시 상세 */}
                                <Link to={`/placeDetail/${place.id}`}>
                                    {place.image ? (
                                        <img
                                            src={`${url}/image?filename=${place.image}`}
                                            alt={place.name}
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                            <div className="w-10 h-14 border-2 rounded-md" />
                                        </div>
                                    )}

                                    {/* 좋아요 수: 이미지 바로 아래 */}
                                    <div className="px-3 mt-2">
                                        <span className="flex items-center text-sm text-gray-700">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 
                          6.5 3.5 5 5.5 5c1.54 0 3.04.99 
                          3.57 2.36h1.87C13.46 5.99 14.96 
                          5 16.5 5 18.5 5 20 6.5 20 
                          8.5c0 3.78-3.4 6.86-8.55 
                          11.54L12 21.35z" />
                                            </svg>
                                            {place.likeCount}
                                        </span>
                                    </div>

                                    {/* tags 1~3 */}
                                    <div className="p-3 space-y-1">
                                        <div className="flex flex-wrap gap-2">
                                            {place.categories.map(cat => (
                                                <span
                                                    key={cat}
                                                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium"
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="font-semibold text-sm">{place.name}</div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 12.414a4 4 0 
                             10-5.657 5.657l4.243 4.243a8 8 0 
                             115.657-5.657z"
                                                />
                                            </svg>
                                            {place.address}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* 더보기 버튼 */}
                    {safe.length > 4 && !showAll && (
                        <div className="text-center mt-10">
                            <button
                                onClick={() => setShowAll(true)}
                                className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                            >
                                더보기
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
