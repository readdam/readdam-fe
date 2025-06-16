import React from 'react';

const reservations = [
    {
        id: 1,
        place: '읊담 강남점 1강의실',
        location: '서울시 강남구',
        date: '2023-11-15',
        time: '18:00 ~ 20:00',
        people: 8,
        image: '/images/reserve1.jpg',
    },
    {
        id: 2,
        place: '읊담 강남점 1강의실',
        location: '서울시 강남구',
        date: '2023-11-20',
        time: '14:00 ~ 16:00',
        people: 6,
        image: '/images/reserve1.jpg',
    },
    {
        id: 3,
        place: '읊담 강남점 1강의실',
        location: '서울시 강남구',
        date: '2023-11-25',
        time: '12:00 ~ 16:00',
        people: 6,
        image: '/images/reserve1.jpg',
    },
];

const MyReservation = () => {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-6">내 예약 목록</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {reservations.map((res) => (
                    <div key={res.id} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <img
                            src={res.image}
                            alt={res.place}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h3 className="text-sm font-bold">{res.place}</h3>
                            <p className="text-sm text-gray-500">📍 {res.location}</p>
                            <p className="text-sm text-gray-500">📅 {res.date}</p>
                            <p className="text-sm text-gray-500">⏰ {res.time}</p>
                            <p className="text-sm text-gray-500">👥 인원 {res.people}명</p>

                            <button className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-semibold">
                                예약 취소
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyReservation;
