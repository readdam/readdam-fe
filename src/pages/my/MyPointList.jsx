import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '../../atoms';
import axios from 'axios';
import { url } from '../../config/config';

const PointHistory = () => {
    const [points, setPoints] = useState([]);
    const [visibleCount, setVisibleCount] = useState(15);

    const [activeTab, setActiveTab] = useState('전체');

    const navigate = useNavigate();
    const token = useAtomValue(tokenAtom);
    const user = useAtomValue(userAtom);

    useEffect(() => {
        if (!token?.access_token) return;

        const fetchPoints = async () => {
            try {
                const res = await axios.post(`${url}/myPointList`,null, {
                    headers: {
                        Authorization: token.access_token,
                    },
                });
                setPoints(res.data);
            } catch (err) {
                console.error('포인트 내역 조회 실패:', err);
            }
        };

        fetchPoints();
    }, [token]);

    const filteredPoints = points.filter((item) => {
        if (activeTab === '전체') return true;
        if (activeTab === '적립') return item.point > 0;
        if (activeTab === '사용') return item.point < 0;
        return true;
    });

    const visiblePoints = filteredPoints.slice(0, visibleCount);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-lg font-bold mb-4">보유 포인트</h2>
            <div className="text-2xl font-bold text-orange-500 mb-6">
                {(user?.totalPoint ?? 0).toLocaleString()} P
            </div>

            <div className="flex border-b mb-4">
                {['전체', '적립', '사용'].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 font-medium ${tab === activeTab
                            ? 'text-orange-500 border-b-2 border-orange-500'
                            : 'text-gray-500'
                            }`}
                        onClick={() => {
                            setActiveTab(tab);
                            setVisibleCount(15);
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <table className="w-full text-sm text-left mb-6">
                <thead>
                    <tr className="border-b">
                        <th className="py-2">구분</th>
                        <th className="py-2">포인트</th>
                        <th className="py-2">사유</th>
                        <th className="py-2">일시</th>
                    </tr>
                </thead>
                <tbody>
                    {visiblePoints.map((item, idx) => (
                        <tr key={idx} className="border-b">
                            <td className="py-2 text-blue-500 font-semibold">
                                {item.point > 0 ? '적립' : '사용'}
                            </td>
                            <td
                                className={`py-2 ${item.point < 0 ? 'text-red-500' : 'text-blue-600'
                                    }`}
                            >
                                {item.point > 0 ? `+${item.point}` : item.point}P
                            </td>
                            <td className="py-2">{item.reason}</td>
                            <td className="py-2">
                                {new Date(item.date).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {visibleCount < filteredPoints.length && (
                <div className="text-center mb-8">
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => setVisibleCount((prev) => prev + 15)}
                    >
                        더보기
                    </button>
                </div>
            )}

            <div className="flex justify-end space-x-2">
                <button

                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    환불신청
                </button>
                <button
                    onClick={() => navigate('/myPointCharge')}
                    className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                    충전하기
                </button>
            </div>


        </div>
    );
};

export default PointHistory;
